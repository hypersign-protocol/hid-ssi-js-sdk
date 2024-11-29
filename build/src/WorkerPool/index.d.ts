export declare class WorkerPool {
    maxWorkers: number;
    path: string;
    constructor(path: string);
    runTask(taskData: any): Promise<unknown>;
    startWorker(task: any): void;
    finishWorker(worker: any): void;
}
//# sourceMappingURL=index.d.ts.map