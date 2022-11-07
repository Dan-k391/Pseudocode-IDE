<template>
    <div id="app">
        <el-container>
            <el-header height="auto" style="text-align:center">
                <h1>Pseudocode interpreter</h1>
            </el-header>
            <el-container>
                <el-aside width="auto" style="text-align:center; padding: 0px; padding-top: 10px;">
                    <el-row>
                        <el-button size="large" type="text" :icon="CaretRight" @click="run">
                            Run
                        </el-button>
                    </el-row>
                </el-aside>
                <el-main height="auto" style="padding: 0px; padding-top: 20px;">
                    <MonacoEditor ref="editor" @run="run"/>
                </el-main>
            </el-container>
            <el-footer height="20%" style="padding: 0px; padding-bottom: 10px; padding-left: 10px;">
                <Xterm ref="terminal" @run="run"/>
            </el-footer>
        </el-container>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import MonacoEditor from './components/MonacoEditor.vue';
import Xterm from './components/XTerm.vue';

import { CaretRight } from "@element-plus/icons-vue";

import { Interpreter } from './interpreter/interpreter';
import { SyntaxError, RuntimeError } from './interpreter/error';

const editor = ref<HTMLElement | null>(null);
const terminal = ref<HTMLElement | null>(null);

function run(): void {
    let code = editor.value!.get_code();
    let interpreter = new Interpreter(code);
    try {
        interpreter.interpret();
    }
    catch (e: any) {
        report(e.toString());
    }
}

function report(err_msg: string): void {
    terminal.value!.report(err_msg);
}
</script>

<style>
.el-textarea>textarea {
    font-family: consolas;
    height: 100% !important;
}

html,
body,
#app,
.el-container,
.el-main>div {
    height: 100%;
    max-height: 100%;
    overflow: hidden;
}

.el-footer>div {
    height: 100%;
    max-height: 100%;
    overflow: hidden;
}
</style>
