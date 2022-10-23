<template>
    <div id="app">
        <el-container>
            <el-header height="auto" style="text-align:center">
                <h1>Pseudocode interpreter</h1>
            </el-header>
            <el-container>
                <el-aside width="auto" style="text-align:center">
                    <el-row style="margin:20px 30px">
                        <el-button size="medium" type="text" @click="run">
                            Run
                            <i class="el-icon-caret-right"></i>
                        </el-button>
                    </el-row>
                </el-aside>
                <el-main height="auto">
                    <MonacoEditor ref="editor" @run="run"/>
                </el-main>
            </el-container>
            <el-footer height="200px">
                <Xterm ref="xterm" @run="run"/>
            </el-footer>
        </el-container>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import MonacoEditor from './components/MonacoEditor.vue';
import Xterm from './components/XTerm.vue';

import { Interpreter } from './interpreter/interpreter';

const editor = ref(null);

function run(): void {
    let code = editor.value.get_code();
    let interpreter = new Interpreter(code);
    interpreter.interpret();
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
