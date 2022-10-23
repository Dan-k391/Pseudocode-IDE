<template>
    <div ref="container" class="main"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, toRefs, watch, defineEmits, defineExpose } from 'vue';
import { useDebounceFn, useResizeObserver, useStorage } from '@vueuse/core';

import * as monaco from 'monaco-editor';
import { Vue } from 'vue-class-component';

const emit = defineEmits<{
    (e: 'run'): void;
}>();

const keywords: Array<string> = ['FUNCTION', 'ENDFUNCTION', 'PROCEDURE', 'ENDPROCEDURE', 'RETURNS', 'RETURN', 'CALL',
                  'DECLARE', 'ARRAY', 'OF', 'TYPE', 'ENDTYPE',
                  'IF', 'THEN', 'ELSE', 'ENDIF', 'WHILE', 'ENDWHILE', 'FOR', 'TO', 'STEP', 'NEXT', 'MOD', 'AND', 'OR', 'NOT',
                  'OUTPUT', 'INPUT', 'RND', 'TIME',
                  'INTEGER', 'REAL', 'CHAR', 'STRING', 'BOOLEAN',
                  'TRUE', 'FALSE'];


const container = ref<HTMLDivElement | null>(null);

let editor: monaco.editor.IStandaloneCodeEditor;

monaco.languages.register({ id: 'pseudocode' });
monaco.languages.setMonarchTokensProvider('pseudocode', {
    keywords,
    tokenizer: {
        root: [
            [/[a-zA-Z_]\w*/, {
                cases: {
                    '@keywords': 'keywords',
                    '@default': 'variable',
                }
            }],
            [/\/\/.*$/, 'comment'],
            [/".*?"/, 'string'],
            [/'.?'/, 'char'],
            [/\d+/, 'number'],
            [/[+\-*/()[\]=<>:,]/, 'operators'],
        ]
    }
});

monaco.editor.defineTheme('pseudocode-theme', {
    base: 'vs',
    inherit: false,
    rules: [
        { token: 'keywords', foreground: '#8e2aa0' },
        { token: 'comment', foreground: '#a1a1a1', fontStyle: 'italic' },
        { token: 'variable', foreground: '#393a42' },
        { token: 'string', foreground: '#71a056' },
        { token: 'char', foreground: '#71a056' },
        { token: 'number', foreground: '#8b690d' },
        { token: 'operators', foreground: '#5a76ef' },
    ],
    colors: {
    }
});

monaco.languages.registerCompletionItemProvider('pseudocode', {
    provideCompletionItems: () => {
        var suggestions = [
            ...keywords.map(keyword => {
                return {
                    label: keyword,
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: keyword,
                };
            }),
        ];
        return { suggestions: suggestions };
    }
});

onMounted(() => {
    editor = monaco.editor.create(container.value!, {
        language: 'pseudocode',
        theme: 'pseudocode-theme',
        fontSize: 18,
        automaticLayout: true
    });

    editor.addAction({
        id: 'run',
        label: 'run',
        keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter
        ],
        run: () => {
            emit('run');
        }
    });
});

function get_code(): string {
    return editor.getValue();
}

defineExpose({
    get_code
});

</script>
