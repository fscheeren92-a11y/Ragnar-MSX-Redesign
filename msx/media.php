<?php
declare(strict_types=1);

require_once __DIR__ . '/../integration/Bootstrap.php';

use PanicCactus\Msx\Backend;
use PanicCactus\Msx\Media;
use PanicCactus\Msx\PrivateData;
use PanicCactus\Msx\AppConfig;
use PanicCactus\Msx\ConfigurationError;
use PanicCactus\Msx\HttpPolicy;
use PanicCactus\Msx\PlaybackTicket;
require_once __DIR__ . '/../integration/Backend.php';
require_once __DIR__ . '/../integration/Media.php';
require_once __DIR__ . '/../integration/HttpPolicy.php';
require_once __DIR__ . '/../integration/PlaybackTicket.php';
ini_set('display_errors', '0');
HttpPolicy::privateHeaders();
try {
    $config = AppConfig::fromEnvironment();
    $config->assertGeneratedOrigin();
    $policy = HttpPolicy::cors($config, $_SERVER, ['GET', 'HEAD'], ['Range'], true);
    if ($policy !== 0) { http_response_code($policy); exit; }
    $hosts = $config->backendHosts();
    if (!extension_loaded('curl')) { http_response_code(503); exit; }
    HttpPolicy::requireHttps($_SERVER);
    $ticket = $_GET['ticket'] ?? '';
    if (!is_string($ticket)) throw new InvalidArgumentException();
    HttpPolicy::startSession($ticket !== '' ? PlaybackTicket::sessionId($ticket) : null);
    if (!isset($_SESSION['auth'], $_SESSION['id_key'], $_SESSION['seen'])
        || !is_array($_SESSION['auth']) || !is_int($_SESSION['seen'])
        || time() < $_SESSION['seen'] || ($ticket === '' && time() - $_SESSION['seen'] > 900)) {
        http_response_code(401); exit;
    }
    $auth = $_SESSION['auth']; $key = $_SESSION['id_key'];
    $acceptHost = static function ($value) use (&$hosts): void {
        if (!is_string($value) || $value === '') return;
        $name = strtolower(trim($value, " \t[]"));
        if ($name === '') return;
        $ip = filter_var($name, FILTER_VALIDATE_IP);
        $named = preg_match('/\A(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?\z/i', $name) === 1;
        if ($ip !== false && filter_var($name, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) return;
        if ($ip === false && !$named) return;
        $hosts[] = $name;
    };
    $sessionHostname = strtolower((string) @parse_url($auth['host'] ?? '', PHP_URL_HOST));
    $acceptHost($sessionHostname);
    $acceptHost(@parse_url($auth['stream'] ?? '', PHP_URL_HOST));
    if ($sessionHostname === '' || !in_array($sessionHostname, $hosts, true)) {
        throw new InvalidArgumentException('DNS de sessão inválido.');
    }

    $format = '';
    $candidates = [];
    if (isset($_GET['resource']) && is_string($_GET['resource'])) {
        $data = PrivateData::open($_GET['resource'], $key);
        if ($ticket !== '') PlaybackTicket::validate($ticket, null, '', $data);
        $url = $data['resource'] ?? null;
        if (!is_string($url)) throw new InvalidArgumentException();
        $resourceHost = @parse_url($url, PHP_URL_HOST);
        if (!is_string($resourceHost) || $resourceHost === '') throw new InvalidArgumentException();
        $acceptHost($resourceHost);
        $candidates = [$url];
        $manifest = preg_match('~\.m3u8(?:\?|$)~i', $url) === 1;
    } else {
        if (!is_string($_GET['item'] ?? null) || !is_string($_GET['format'] ?? null)) throw new InvalidArgumentException();
        if ($ticket !== '') PlaybackTicket::validate($ticket, $_GET['item'], $_GET['format']);
        $item = Media::selection($_GET['item'], $key);
        $candidates = Media::sourceCandidates($auth, $item, $_GET['format']);
        foreach ($candidates as $candidate) $acceptHost(@parse_url($candidate, PHP_URL_HOST));
        $url = $candidates[0];
        $manifest = $_GET['format'] === 'm3u8';
        $format = strtolower($_GET['format']);
    }
    $fallbackMime = [
        'm3u8' => 'application/vnd.apple.mpegurl', 'ts' => 'video/mp2t', 'mp4' => 'video/mp4',
        'm4v' => 'video/mp4', 'mov' => 'video/mp4', 'webm' => 'video/webm', 'ogg' => 'video/ogg',
        'mkv' => 'video/x-matroska', 'avi' => 'video/x-msvideo',
    ][$format] ?? '';
    $_SESSION['seen'] = time();
    session_write_close();
    @set_time_limit(0);
    while (ob_get_level() > 0) ob_end_clean();
    $backend = new Backend($hosts);
    if (!isset($_GET['resource']) && count($candidates) > 1) {
        $probeStatuses = [];
        $found = false;
        foreach ($candidates as $candidate) {
            $probe = $backend->probe($candidate);
            $probeStatuses[] = (int) $probe['status'];
            if (($item['kind'] ?? '') === 'movies') \PanicCactus\Msx\PrivateStore::diagnostic(
                'vod_probe_' . $format, ['status'=>(int)$probe['status'],'count'=>count($probeStatuses)]);

            if ($probe['ok']) { $url = $candidate; $found = true; break; }
        }
        if (!$found) \PanicCactus\Msx\PrivateStore::diagnostic('media_probe_failed',
            ['format' => $format, 'statuses' => $probeStatuses]);
        if (preg_match('/\.([a-z0-9]{1,12})(?:\?|$)/i', $url, $extensionMatch)) {
            $chosen = strtolower($extensionMatch[1]);
            $manifest = $chosen === 'm3u8';
            if (isset($fallbackMime) && $chosen !== '' && isset([
                'm3u8' => 'application/vnd.apple.mpegurl', 'ts' => 'video/mp2t', 'mp4' => 'video/mp4',
                'm4v' => 'video/mp4', 'mov' => 'video/mp4', 'webm' => 'video/webm', 'ogg' => 'video/ogg',
                'mkv' => 'video/x-matroska', 'avi' => 'video/x-msvideo',
            ][$chosen])) {
                $fallbackMime = [
                    'm3u8' => 'application/vnd.apple.mpegurl', 'ts' => 'video/mp2t', 'mp4' => 'video/mp4',
                    'm4v' => 'video/mp4', 'mov' => 'video/mp4', 'webm' => 'video/webm', 'ogg' => 'video/ogg',
                    'mkv' => 'video/x-matroska', 'avi' => 'video/x-msvideo',
                ][$chosen];
            }
        }
    }
    $backend->relay($url, $_SERVER['HTTP_RANGE'] ?? '', ($_SERVER['REQUEST_METHOD'] ?? '') === 'HEAD', $manifest,
        static function (string $body, string $base) use ($key, $ticket, $config): string {
            return Media::rewritePlaylist($body, $base, $key, $ticket);
        }, 0, $fallbackMime);
} catch (ConfigurationError $error) {
    \PanicCactus\Msx\PrivateStore::diagnostic('media_configuration');
    if (!headers_sent()) http_response_code(503);
} catch (InvalidArgumentException $error) {
    if (!headers_sent()) http_response_code(403);
} catch (Throwable $error) {
    \PanicCactus\Msx\PrivateStore::diagnostic('media_failed');
    if (!headers_sent()) { http_response_code(502); header('Content-Type: text/plain; charset=UTF-8'); echo 'Mídia indisponível.'; }
}
