const { Queue } = require('bullmq');
const Redis = require('ioredis');

/*
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});
*/
const connection = null;

let redisWarningShown = false;
if (connection) {
    connection.on('error', (err) => {
        if (!redisWarningShown) {
            console.warn('⚠️ GitHub App sync is DISABLED: Redis is not connected. (port 6379)');
            redisWarningShown = true;
        }
    });
}

const githubQueue = connection ? new Queue('github-sync', { connection }) : { add: () => console.log('Redis Dummy Queue: sync skipped') };

const enqueueSync = async (projectId, data) => {
    if (!githubQueue.add) return;
    return await githubQueue.add('sync-repo', { projectId, ...data }, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000
        }
    });
};

module.exports = {
    githubQueue,
    enqueueSync,
    connection
};
