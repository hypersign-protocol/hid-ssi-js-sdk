import { Worker } from 'worker_threads';

globalThis.workers = [];
globalThis.taskQueue = [];
export class WorkerPool {
  maxWorkers: number;

  path: string;
  constructor(path: string) {
    this.maxWorkers = Number(process.env.UV_THREADPOOL_SIZE) || 4;

    this.path = path;
  }

  runTask(taskData) {
    return new Promise((resolve, reject) => {
      const task = { path: this.path, taskData, resolve, reject };

      if (globalThis.workers.length < this.maxWorkers) {
        this.startWorker(task);
      } else {
        globalThis.taskQueue.push(task);
      }
    });
  }

  startWorker(task) {
    const worker = new Worker(task.path, { workerData: task.taskData });

    worker.on('message', (data) => {
      task.resolve(data.result);
      this.finishWorker(worker);
    });

    worker.on('error', (err) => {
      task.reject(err);
      this.finishWorker(worker);
    });

    worker.on('exit', (code) => {
      if (code !== 0) console.error(`Worker exited with code ${code}`);
    });

    globalThis.workers.push(worker);
  }

  finishWorker(worker) {
    globalThis.workers = globalThis.workers.filter((w) => w !== worker);

    if (globalThis.taskQueue.length > 0) {
      const nextTask = globalThis.taskQueue.shift();

      this.startWorker(nextTask);
    }
  }
}

// Example usage
// const pool = new WorkerPool(4); // Limit to 4 threads

// for (let i = 0; i < 10; i++) {
//   pool.runTask({ value: i }).then((result) => {
//     console.log('Result:', result);
//   });
// }
