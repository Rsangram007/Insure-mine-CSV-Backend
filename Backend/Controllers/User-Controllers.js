const userHelpers = require('../Utils/User-Helpers.js');
const { Worker, isMainThread } = require('worker_threads');
const path = require('path');

// Helper function to get the worker path
const getWorkerPath = () => {
    return path.join(__dirname, '../utils/workerThreads.js');
};

// Upload data function using worker threads
const uploadData = (req, res) => {
    if (isMainThread) {
        const worker = new Worker(getWorkerPath());
        worker.on('message', async (data) => {
            const policyPromiseArray = [];
            try {
                for (let single of data) {
                    const promiseArray = [
                        userHelpers.addUser(single),
                        userHelpers.addAgent(single.agent),
                        userHelpers.addCarrier(single.company_name),
                        userHelpers.addCategory(single.category_name),
                        userHelpers.addAccountName(single.account_name)
                    ];
                    const result = await Promise.allSettled(promiseArray);
                    const response = result.every(singleResult => singleResult.status === 'fulfilled');

                    if (response) {
                        const ids = result.map(singleId => singleId.value);
                        policyPromiseArray.push(userHelpers.addPolicy(single, ids));
                    }
                }
                const resultPromise = await Promise.all(policyPromiseArray);
                if (resultPromise) res.status(200).json({ message: `Policies added/existing: ${resultPromise.length}`, "Resopnse": resultPromise });
            } catch (error) {
                res.status(404).send(`Error occurred: ${error}`);
            }
        });

        worker.on('error', (msg) => res.status(404).send(`Error occurred: ${msg}`));
        worker.on('exit', (code) => {
            if (code !== 0) console.log(`Worker stopped with exit code ${code}`);
        });

        worker.postMessage(req.file.path);
    }
};

// Retrieve a specific user
const getUser = async (req, res) => {
    const { username } = req.query;
    const response = await userHelpers.getUserName(username);
    if (response) res.status(200).json(response);
};

// Retrieve policy info for a specific user
const getPolicyInfo = async (req, res) => {
    const { username } = req.query;
    console.log('Getting policy info for username:', username);
    const response = await userHelpers.getUserPolicy(username);
    if (response) res.status(200).json(response);
};

// Retrieve all policies information
const getAllPoliciesInfo = async (req, res) => {
    const response = await userHelpers.getUserPolicies();
    if (response) res.status(200).json({ "Total Document": response.length, "Response": response });
};

// Export each function individually for use in routes
module.exports = {
    uploadData,
    getUser,
    getPolicyInfo,
    getAllPoliciesInfo
};
