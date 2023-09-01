import { IExecutor } from './Executor';
import ITask from './Task';

export default async function run(executor: IExecutor, queue: AsyncIterable<ITask>, maxThreads = 0) {
    maxThreads = Math.max(0, maxThreads);
    /**
     * Код надо писать сюда
     * Тут что-то вызываем в правильном порядке executor.executeTask для тасков из очереди queue
     */
    const tasks = new Tasks();

    for await (const currentTask of queue) {
        const allTasks: Promise<number>[] = tasks.getTasksArrayPromises();

        if (
            maxThreads !== 0
            && allTasks.length >= maxThreads
        ) {
            const targetIdOfResolvedPromise = await Promise.race(allTasks);

            tasks.deleteTaskById(targetIdOfResolvedPromise);
        }

        tasks.addTask(currentTask, executor);
    }

    const promisesArrayTasks: Promise<number>[] = tasks.getTasksArrayPromises();

    await Promise.all(promisesArrayTasks);

    tasks.clearTasksList();

    if (promisesArrayTasks.length > 0) {
        await run(executor, queue, maxThreads);
    }
}

/** Класс для работы с тасками */
class Tasks {
    /** Мапа в которой будем хранить очереди однотипных тасок */
    _mapTasks = new Map<number, Promise<number>>();

    /**
     * Добавить новую таску или закинуть таску в очередь ей подобных (однотипных)
     *
     * @param task - таска
     * @param executor - executor для выполнения таски
     */
    addTask(task: ITask, executor: IExecutor) {
        const {
            targetId: key,
        } = task;

        const promiseOfCurrentTask = this._mapTasks.get(key);

        if (promiseOfCurrentTask) {
            const promise = promiseOfCurrentTask
                .then(() => executor.executeTask(task))
                .then(() => key)
            ;

            this._mapTasks.set(key, promise);
        }
        else {
            const promise = executor
                .executeTask(task)
                .then(() => key)
            ;

            this._mapTasks.set(key, promise);
        }
    }

    /**
     * Получить массив промисов,
     * каждый из которых хранит очередь однотипных тасок,
     * каждый промис из массива зарезолвится ТОЛЬКО после того,
     * как очередь "разрядиться" (выполниться "promise chain").
     */
    getTasksArrayPromises(): Promise<number>[] {
        return Array.from(
            this._mapTasks,
            ([, promise]) => promise
        )
            ;
    }

    /**
     * Удалить "promise chain" таски по id
     *
     * @param targetId - id таски, которую собираемся удалять
     */
    deleteTaskById(targetId: number) {
        this._mapTasks.delete(targetId);
    }

    /** Удалить все очереди тасок */
    clearTasksList() {
        this._mapTasks.clear();
    }
}