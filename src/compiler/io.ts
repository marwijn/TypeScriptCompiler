//﻿
// Copyright (c) Microsoft Corporation.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

interface IResolvedFile {
    content: string;
    path: string;
}

interface IFileWatcher {
    close(): void;
}

interface IIO {
    readFile(path: string): string;
    writeFile(path: string, contents: string): void;
    createFile(path: string, useUTF8?: bool): ITextWriter;
    deleteFile(path: string): void;
    dir(path: string, re?: RegExp, options?: { recursive?: bool; }): string[];
    fileExists(path: string): bool;
    directoryExists(path: string): bool;
    createDirectory(path: string): void;
    resolvePath(path: string): string;
    dirName(path: string): string;
    findFile(rootPath: string, partialFilePath: string): IResolvedFile;
    print(str: string): void;
    printLine(str: string): void;
    arguments: string[];
    stderr: ITextWriter;
    stdout: ITextWriter;
    watchFile(filename: string, callback: (string) => void ): IFileWatcher;
    run(source: string, filename: string): void;
    getExecutingFilePath(): string;
    quit(exitCode?: number);
}

module IOUtils {
    // Creates the directory including its parent if not already present
    function createDirectoryStructure(ioHost: IIO, dirName: string) {
        if (ioHost.directoryExists(dirName)) {
            return;
        }

        var parentDirectory = ioHost.dirName(dirName);
        if (parentDirectory != "") {
            createDirectoryStructure(ioHost, parentDirectory);
        }
        ioHost.createDirectory(dirName);
    }

    // Creates a file including its directory structure if not already present
    export function createFileAndFolderStructure(ioHost: IIO, fileName: string, useUTF8?: bool) {
        var path = ioHost.resolvePath(fileName);
        var dirName = ioHost.dirName(path);
        createDirectoryStructure(ioHost, dirName);
        return ioHost.createFile(path, useUTF8);
    }

    export function throwIOError(message: string, error: Error) {
        var errorMessage = message;
        if (error && error.message) {
            errorMessage += (" " + error.message);
        }
        throw new Error(errorMessage);
    }
}

// Declare dependencies needed for all supported hosts
declare class Enumerator {
    public atEnd(): bool;
    public moveNext();
    public item(): any;
    constructor (o: any);
}
declare function setTimeout(callback: () =>void , ms?: number);
declare var require: any;
declare module process {
    export var argv: string[];
    export var platform: string;
    export function on(event: string, handler: (any) => void ): void;
    export module stdout {
        export function write(str: string);
    }
    export module stderr {
        export function write(str: string);
    }
    export module mainModule {
        export var filename: string;
    }
    export function exit(exitCode?: number);
}

declare var bridge: any;

class FileWriter implements ITextWriter
{
    writer : any;
    constructor (writer: any)
    {
        this.writer = writer;
    }

    public WriteLine(text: string) : void
    {
        bridge.Print("WriteLine");
        bridge.Print(text);
        this.writer.WriteLine(text);
    }

    public Write(text: string): void 
    {
        bridge.Print("Write");
        bridge.Print(text);
        this.writer.Write(text);
    }

    public Close(): void {
        bridge.Print("Writer.Close");
        this.writer.Close();
    }
}

class DebugTextWriter implements ITextWriter
{
    public WriteLine(text: string) : void
    {
        bridge.Print(text);
        bridge.Print("\n");
    }

    public Write(text: string): void 
    {
        bridge.Print(text);
    }

    public Close(): void { }
}

class DummyFileWatcher implements IFileWatcher
{
    close()
    { }
}

    class IOImpl implements IIO
    {
    arguments: string[];
    stderr: ITextWriter;
    stdout: ITextWriter;

    constructor () {
        bridge.Print("IOImpl constructor");
        this.stderr = new DebugTextWriter();
        this.stdout = new DebugTextWriter();
        this.arguments = [bridge.SourceFile, "--comments", "--declaration", "--out", "test"];

        bridge.Print(this.arguments[0]);
    }

    readFile(path: string): string {
        bridge.Print("readFile {0}", path);
        return bridge.ReadFile(path);
    }

    writeFile(path: string, contents: string): void {
        bridge.Print("writeFile");
    }

    createFile(path: string, useUTF8?: bool): ITextWriter {
        bridge.Print("createFile");
        return new FileWriter(bridge.CreateWriter(path));
    }

    deleteFile(path: string): void {
        bridge.Print("deleteFile");
    }

    dir(path: string, re?: RegExp, options?: { recursive?: bool; }): string[] {
        bridge.Print("dir");
        return null;
    }

    fileExists(path: string): bool {
        bridge.Print("fileExists");
        return bridge.FileExists(path);
    }

    directoryExists(path: string): bool {
        bridge.Print("directoryExists");
        return bridge.DirectoryExists(path);
    }

    createDirectory(path: string): void {
        bridge.Print("createDirectory");
        bridge.CreateDirectory(path);
    }
    resolvePath(path: string): string {
        bridge.Print("resolvePath {0}", path);
        return path;
    }
    dirName(path: string): string {
        bridge.Print("dirName {0}", path);
        return bridge.DirName(path);
    }

    findFile(rootPath: string, partialFilePath: string): IResolvedFile {
        bridge.Print("findFile {0} {1}", rootPath, partialFilePath);
        return null;
    }
    print(str: string): void {
        bridge.Print("print");
        bridge.Print(str);
    }

    printLine(str: string): void {
        bridge.Print("printLine");
        bridge.Print(str);
        bridge.Print('\n');
    }

    watchFile(filename: string, callback: (string) => void ): IFileWatcher {
        bridge.Print("watchFile");
        return new DummyFileWatcher();
    }

    run(source: string, filename: string): void {
        bridge.Print("run");
    }

    getExecutingFilePath(): string {
        bridge.Print("getExecutingFilePath");
        return "<ExecutingPath>";
    }
    quit(exitCode?: number) {
        bridge.Print("quit");
    }
}

var IO = new IOImpl();

bridge.Print("IO:");
bridge.Print(IO.arguments[0]);
