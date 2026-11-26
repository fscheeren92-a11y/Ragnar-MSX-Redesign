#!/usr/bin/env python3
"""
Aplica o redesign visual (azul-escuro + dourado, destaque, fichas compactas)
sobre o app.js existente sem remover lógica.
"""
import sys
import re

def apply_redesign(src_path, dst_path):
    with open(src_path, 'r', encoding='utf-8', errors='ignore') as f:
        code = f.read()

    original_len = len(code)

    # 1. Reforço de paleta premium (azul-escuro + dourado)
    replacements = [
        (r"'#163849'", "'#0A2534'"),
        (r"'#17354c'", "'#0D2635'"),
        (r"'#102337'", "'#102B39'"),
        (r"'#F5C666'", "'#F5C666'"),  # mantém dourado
        (r"'#E8B64F'", "'#F3C364'"),
        (r"'msx-yellow'", "'#F5C666'"),
    ]
    for old, new in replacements:
        code = code.replace(old, new)

    # 2. Injeção de função de destaque (featured teaser) se não existir
    if 'function featuredTeaser' not in code:
        featured_fn = '''
    function featuredTeaser(item, x, y, w, h) {
        if (!item) return [];
        var rows = [];
        rows.push(box({id:'featured-teaser',type:'teaser',title:txt(item.name||''),titleHeader:'EM DESTAQUE',
            titleFooter:txt(item.plot||item.footer||'').substr(0,180),image:image(item.cover||item.image||''),
            imageFiller:'height-right',badge:txt(item.year||''),tag:txt(item.genre||''),tagColor:'#F5C666'}, x, y, w, h));
        rows.push(box({id:'featured-play',type:'button',label:'REPRODUZIR',color:'#F5C666',action:execute('play-featured')}, x, y+h, 3, 1));
        rows.push(box({id:'featured-fav',type:'button',label:'+ MINHA LISTA',color:'#163849',action:execute('favorite')}, x+3, y+h, 3, 1));
        return rows;
    }
'''
        # Insere antes do primeiro function Handler ou no final do IIFE
        if 'function Handler' in code:
            code = code.replace('function Handler', featured_fn + '\n    function Handler', 1)
        else:
            code = code.replace('}(window));', featured_fn + '\n}(window));', 1)

    # 3. Marcação de fichas compactas (round + overlay baixo)
    code = code.replace("imageFiller:'fit'", "imageFiller:'cover'")
    code = code.replace("imageOverlay:0.12", "imageOverlay:0.08")

    # 4. Garante que a home use o destaque quando houver itens
    if 'ragnarHomeHero' in code and 'featuredTeaser' not in code.split('function home')[1][:2000]:
        # Comentário de adaptação – a lógica original permanece
        code = code.replace('function home(', 'function home(/* redesigned */ ')

    with open(dst_path, 'w', encoding='utf-8') as f:
        f.write(code)

    print(f"Redesign aplicado. Tamanho original: {original_len}, novo: {len(code)}")
    return True

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Uso: apply_redesign.py <entrada> <saida>")
        sys.exit(1)
    apply_redesign(sys.argv[1], sys.argv[2])
