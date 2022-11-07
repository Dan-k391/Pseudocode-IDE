<template>
    <div ref="container"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, toRefs, watch, defineEmits, defineExpose } from "vue";
import { Terminal } from "xterm";
import { FitAddon } from 'xterm-addon-fit';

import "xterm/css/xterm.css";

const emit = defineEmits<{
    (e: "run"): void;
}>();

const container = ref<HTMLDivElement | null>(null);

let terminal: Terminal;
let fit_addon: FitAddon;

let cmd = "";
let prefix = "$ ";

function execute_cmd(cmd: string): void {
    if (cmd == "help") {
        terminal.writeln("help: show help");
        terminal.writeln("run: run the code");
        terminal.writeln("clear/cls: clear the terminal");
        terminal.write(prefix);
    } else if (cmd == "run") {
        emit("run");
        terminal.write(prefix);
    } else if (cmd == "clear" || cmd == "cls") {
        terminal.clear();
        terminal.write(prefix);
    } else if (cmd == "egg") {
        terminal.writeln("An egg? Maybe...");
        terminal.write(prefix);
    } else {
        terminal.writeln(cmd + ": Command not found");
        terminal.write(prefix);
    }
}

function update_size(): void {
    if (terminal) {
        fit_addon.fit();
    }
    console.log("update terminal size");
}

onMounted(() => {
    terminal = new Terminal({
        theme: {
            foreground: "white",
            background: "#696969",
        },
    });
    fit_addon = new FitAddon();
    terminal.loadAddon(fit_addon);
    terminal.open(container.value!);
    update_size();
    terminal.writeln("Welcome to the Pseudocode interpreter");
    terminal.writeln("Type 'help' to see the available commands");
    terminal.write(prefix);

    terminal.onData((e) => {
        switch (e) {
            case "\u0003":
                terminal.writeln("^C");
                terminal.write(prefix);
                break;
            case "\r":
                terminal.writeln("");
                execute_cmd(cmd);
                cmd = "";
                break;
            case "\u007F":
                if (terminal._core.buffer.x > 2) {
                    terminal.write("\b \b");
                    if (cmd.length > 0) {
                        cmd = cmd.substr(0, cmd.length - 1);
                    }
                }
                break;
            default:
                if (
                    (e >= String.fromCharCode(0x20) &&
                        e <= String.fromCharCode(0x7e)) ||
                    e >= "\u00a0"
                ) {
                    cmd += e;
                    terminal.write(e);
                }
        }
    });
});

function report(msg: string): void {
    terminal.writeln(msg);
    terminal.write(prefix);
}

defineExpose({
    report
});
</script>
