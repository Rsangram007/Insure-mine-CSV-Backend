const User = require('../Model/User-Model.js');
const Agent = require('../Model/Agent-Model.js');
const PolicyCarrier = require('../Model/Policy-Carrier-Model.js');
const PolicyCategory = require('../Model/Policy-Category-Model.js');
const PolicyInfo = require('../Model/Policy-Info-Model.js');
const UsersAccount = require('../Model/Users-Account-Model.js');



const addUser = async (data) => {
    const response = await User.findOneAndUpdate(
        { firstname: data?.firstname },
        {
            $setOnInsert: {
                firstname: data.firstname,
                dob: data?.dob,
                address: data?.address,
                phone: data?.phone,
                state: data?.state,
                zip: data?.zip,
                email: data?.email,
                gender: data?.gender
            }
        },
        { upsert: true, new: true }
    );
    return response?._id;
};

const addAgent = async (agent) => {
    const response = await Agent.findOneAndUpdate(
        { agent },
        { $setOnInsert: { agent } },
        { upsert: true, new: true }
    );
    return response?._id;
};

const addCarrier = async (company_name) => {
    const response = await PolicyCarrier.findOneAndUpdate(
        { company_name },
        { $setOnInsert: { company_name } },
        { upsert: true, new: true }
    );
    return response?._id;
};

const addCategory = async (category_name) => {
    const response = await PolicyCategory.findOneAndUpdate(
        { category_name },
        { $setOnInsert: { category_name } },
        { upsert: true, new: true }
    );
    return response?._id;
};

const addAccountName = async (account_name) => {
    const response = await UsersAccount.findOneAndUpdate(
        { account_name },
        { $setOnInsert: { account_name } },
        { upsert: true, new: true }
    );
    return response?._id;
};

const addPolicy = async (data, ids) => {
    const response = await PolicyInfo.findOneAndUpdate(
        { policy_number: data?.policy_number },
        {
            $setOnInsert: {
                policy_number: data.policy_number,
                policy_type: data?.policy_type,
                producer: data?.producer,
                csr: data?.csr,
                premium_amount: data?.premium_amount,
                policy_start_date: data?.policy_start_date,
                policy_end_date: data?.policy_end_date,
                userId: ids[0],
                agentId: ids[1],
                carrierId: ids[2],
                categoryId: ids[3],
                accountNameId: ids[4]
            }
        },
        { upsert: true, new: true }
    );
    return response?._id;
};

const getUserName = async (userName) => {
    const regex = new RegExp(userName, 'i');
    return await UsersAccount.find({ account_name: { $regex: regex } }, { account_name: 1 });
};
const getUserPolicy = async (userName) => {
    console.log("Starting getUserPolicy aggregation");

    try {
        // Match user account based on account_name
        console.log("Matching user account with account_name:", userName);
        const accountMatchResult = await UsersAccount.aggregate([
            { $match: { account_name: userName } }
        ]);
        // console.log("Matched user account:", accountMatchResult);

        // Lookup associated policy data based on accountNameId
        const policyLookupResult = await UsersAccount.aggregate([
            { $match: { account_name: userName } },
            {
                $lookup: {
                    from: "policyinfos",
                    localField: "_id",
                    foreignField: "accountNameId",
                    as: "policyResult"
                }
            }
        ]);
        // console.log("After policy lookup:", policyLookupResult);

        // Unwind policyResult array to flatten the data
        const policyUnwindResult = await UsersAccount.aggregate([
            { $match: { account_name: userName } },
            {
                $lookup: {
                    from: "policyinfos",
                    localField: "_id",
                    foreignField: "accountNameId",
                    as: "policyResult"
                }
            },
            { $unwind: "$policyResult" }
        ]);
        // console.log("After unwinding policyResult:", policyUnwindResult);

        // Lookup agent information for each policy
        const agentLookupResult = await UsersAccount.aggregate([
            { $match: { account_name: userName } },
            {
                $lookup: {
                    from: "policyinfos",
                    localField: "_id",
                    foreignField: "accountNameId",
                    as: "policyResult"
                }
            },
            { $unwind: "$policyResult" },
            {
                $lookup: {
                    from: "agents",
                    localField: "policyResult.agentId",
                    foreignField: "_id",
                    as: "agentResult"
                }
            }
        ]);
        // console.log("After agent lookup:", agentLookupResult);

        // Lookup carrier information for each policy
        const carrierLookupResult = await UsersAccount.aggregate([
            { $match: { account_name: userName } },
            {
                $lookup: {
                    from: "policyinfos",
                    localField: "_id",
                    foreignField: "accountNameId",
                    as: "policyResult"
                }
            },
            { $unwind: "$policyResult" },
            {
                $lookup: {
                    from: "agents",
                    localField: "policyResult.agentId",
                    foreignField: "_id",
                    as: "agentResult"
                }
            },
            { $unwind: "$agentResult" },
            {
                $lookup: {
                    from: "policycarriers",
                    localField: "policyResult.carrierId",
                    foreignField: "_id",
                    as: "carrierResult"
                }
            }
        ]);
        // console.log("After carrier lookup:", carrierLookupResult);

        // Lookup category information for each policy
        const categoryLookupResult = await UsersAccount.aggregate([
            { $match: { account_name: userName } },
            {
                $lookup: {
                    from: "policyinfos",
                    localField: "_id",
                    foreignField: "accountNameId",
                    as: "policyResult"
                }
            },
            { $unwind: "$policyResult" },
            {
                $lookup: {
                    from: "agents",
                    localField: "policyResult.agentId",
                    foreignField: "_id",
                    as: "agentResult"
                }
            },
            { $unwind: "$agentResult" },
            {
                $lookup: {
                    from: "policycarriers",
                    localField: "policyResult.carrierId",
                    foreignField: "_id",
                    as: "carrierResult"
                }
            },
            { $unwind: "$carrierResult" },
            {
                $lookup: {
                    from: "policycategories",
                    localField: "policyResult.categoryId",
                    foreignField: "_id",
                    as: "categoryResult"
                }
            }
        ]);
        // console.log("After category lookup:", categoryLookupResult);

        // Project necessary fields for the final output
        const projectResult = await UsersAccount.aggregate([
            { $match: { account_name: userName } },
            {
                $lookup: {
                    from: "policyinfos",
                    localField: "_id",
                    foreignField: "accountNameId",
                    as: "policyResult"
                }
            },
            { $unwind: "$policyResult" },
            {
                $lookup: {
                    from: "agents",
                    localField: "policyResult.agentId",
                    foreignField: "_id",
                    as: "agentResult"
                }
            },
            { $unwind: "$agentResult" },
            {
                $lookup: {
                    from: "policycarriers",
                    localField: "policyResult.carrierId",
                    foreignField: "_id",
                    as: "carrierResult"
                }
            },
            { $unwind: "$carrierResult" },
            {
                $lookup: {
                    from: "policycategories",
                    localField: "policyResult.categoryId",
                    foreignField: "_id",
                    as: "categoryResult"
                }
            },
            { $unwind: "$categoryResult" },
            {
                $project: {
                    _id: "$policyResult._id",
                    account_name: 1,
                    agent_name: "$agentResult.agent",
                    company_name: "$carrierResult.company_name",
                    category_name: "$categoryResult.category_name",
                    policy_number: "$policyResult.policy_number",
                    policy_type: "$policyResult.policy_type",
                    producer: "$policyResult.producer",
                    csr: "$policyResult.csr",
                    premium_amount: "$policyResult.premium_amount",
                    policy_start_date: "$policyResult.policy_start_date",
                    policy_end_date: "$policyResult.policy_end_date",
                    createdAt: "$policyResult.createdAt",
                    updatedAt: "$policyResult.updatedAt"
                }
            }
        ]);
        // console.log("After projecting final result:", projectResult);

        // Return the final result or an empty array if no data found
        return projectResult.length > 0 ? projectResult : [];
    } catch (error) {
        console.error("Error getting user policy:", error);
        throw new Error("Error fetching user policy");
    }
};


const getUserPolicies = async () => {
    console.log("Starting getUserPolicies aggregation");

    // Lookup users based on userId
    const userLookupResult = await PolicyInfo.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userResult"
            }
        }
    ]);
    // console.log("After $lookup users:", userLookupResult);

    // Lookup agents based on agentId
    const agentLookupResult = await PolicyInfo.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userResult"
            }
        },
        {
            $lookup: {
                from: "agents",
                localField: "agentId",
                foreignField: "_id",
                as: "agentResult"
            }
        }
    ]);
    // console.log("After $lookup agents:", agentLookupResult);

    // Lookup policy carriers based on carrierId
    const carrierLookupResult = await PolicyInfo.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userResult"
            }
        },
        {
            $lookup: {
                from: "agents",
                localField: "agentId",
                foreignField: "_id",
                as: "agentResult"
            }
        },
        {
            $lookup: {
                from: "policycarriers",
                localField: "carrierId",
                foreignField: "_id",
                as: "carrierResult"
            }
        }
    ]);
    // console.log("After $lookup policy carriers:", carrierLookupResult);

    // Lookup policy categories based on categoryId
    const categoryLookupResult = await PolicyInfo.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userResult"
            }
        },
        {
            $lookup: {
                from: "agents",
                localField: "agentId",
                foreignField: "_id",
                as: "agentResult"
            }
        },
        {
            $lookup: {
                from: "policycarriers",
                localField: "carrierId",
                foreignField: "_id",
                as: "carrierResult"
            }
        },
        {
            $lookup: {
                from: "policycategories",
                localField: "categoryId",
                foreignField: "_id",
                as: "categoryResult"
            }
        }
    ]);
    // console.log("After $lookup policy categories:", categoryLookupResult);

    // Lookup users' accounts based on accountNameId
    const accountLookupResult = await PolicyInfo.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userResult"
            }
        },
        {
            $lookup: {
                from: "agents",
                localField: "agentId",
                foreignField: "_id",
                as: "agentResult"
            }
        },
        {
            $lookup: {
                from: "policycarriers",
                localField: "carrierId",
                foreignField: "_id",
                as: "carrierResult"
            }
        },
        {
            $lookup: {
                from: "policycategories",
                localField: "categoryId",
                foreignField: "_id",
                as: "categoryResult"
            }
        },
        {
            $lookup: {
                from: "usersaccounts",
                localField: "accountNameId",
                foreignField: "_id",
                as: "accountNameResult"
            }
        }
    ]);
    // console.log("After $lookup users' accounts:", accountLookupResult);

    // Unwind the fields to flatten data
    const unwindResult = await PolicyInfo.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userResult"
            }
        },
        {
            $lookup: {
                from: "agents",
                localField: "agentId",
                foreignField: "_id",
                as: "agentResult"
            }
        },
        {
            $lookup: {
                from: "policycarriers",
                localField: "carrierId",
                foreignField: "_id",
                as: "carrierResult"
            }
        },
        {
            $lookup: {
                from: "policycategories",
                localField: "categoryId",
                foreignField: "_id",
                as: "categoryResult"
            }
        },
        {
            $lookup: {
                from: "usersaccounts",
                localField: "accountNameId",
                foreignField: "_id",
                as: "accountNameResult"
            }
        },
        { $unwind: { path: "$userResult" } },
        { $unwind: { path: "$agentResult" } },
        { $unwind: { path: "$carrierResult" } },
        { $unwind: { path: "$categoryResult" } },
        { $unwind: { path: "$accountNameResult" } }
    ]);
    // console.log("After unwinding all fields:", unwindResult);

    // Project the necessary fields
    const projectResult = await PolicyInfo.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userResult"
            }
        },
        {
            $lookup: {
                from: "agents",
                localField: "agentId",
                foreignField: "_id",
                as: "agentResult"
            }
        },
        {
            $lookup: {
                from: "policycarriers",
                localField: "carrierId",
                foreignField: "_id",
                as: "carrierResult"
            }
        },
        {
            $lookup: {
                from: "policycategories",
                localField: "categoryId",
                foreignField: "_id",
                as: "categoryResult"
            }
        },
        {
            $lookup: {
                from: "usersaccounts",
                localField: "accountNameId",
                foreignField: "_id",
                as: "accountNameResult"
            }
        },
        { $unwind: { path: "$userResult" } },
        { $unwind: { path: "$agentResult" } },
        { $unwind: { path: "$carrierResult" } },
        { $unwind: { path: "$categoryResult" } },
        { $unwind: { path: "$accountNameResult" } },
        {
            $project: {
                _id: "$accountNameResult._id",
                firstname: "$userResult.firstname",
                dob: "$userResult.dob",
                address: "$userResult.address",
                phone: "$userResult.phone",
                state: "$userResult.state",
                zip: "$userResult.zip",
                email: "$userResult.email",
                gender: "$userResult.gender",
                policy_number: 1,
                policy_type: 1,
                producer: 1,
                csr: 1,
                agent: "$agentResult.agent",
                company_name: "$carrierResult.company_name",
                category_name: "$categoryResult.category_name",
                premium_amount: 1,
                policy_start_date: 1,
                policy_end_date: 1,
                createdAt: 1,
                updatedAt: 1,
                account_name: "$accountNameResult.account_name"
            }
        }
    ]);
    // console.log("After $project stage:", projectResult);

    // Group policies by account_name
    const groupResult = await PolicyInfo.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userResult"
            }
        },
        {
            $lookup: {
                from: "agents",
                localField: "agentId",
                foreignField: "_id",
                as: "agentResult"
            }
        },
        {
            $lookup: {
                from: "policycarriers",
                localField: "carrierId",
                foreignField: "_id",
                as: "carrierResult"
            }
        },
        {
            $lookup: {
                from: "policycategories",
                localField: "categoryId",
                foreignField: "_id",
                as: "categoryResult"
            }
        },
        {
            $lookup: {
                from: "usersaccounts",
                localField: "accountNameId",
                foreignField: "_id",
                as: "accountNameResult"
            }
        },
        { $unwind: { path: "$userResult" } },
        { $unwind: { path: "$agentResult" } },
        { $unwind: { path: "$carrierResult" } },
        { $unwind: { path: "$categoryResult" } },
        { $unwind: { path: "$accountNameResult" } },
        {
            $project: {
                _id: "$accountNameResult._id",
                firstname: "$userResult.firstname",
                dob: "$userResult.dob",
                address: "$userResult.address",
                phone: "$userResult.phone",
                state: "$userResult.state",
                zip: "$userResult.zip",
                email: "$userResult.email",
                gender: "$userResult.gender",
                policy_number: 1,
                policy_type: 1,
                producer: 1,
                csr: 1,
                agent: "$agentResult.agent",
                company_name: "$carrierResult.company_name",
                category_name: "$categoryResult.category_name",
                premium_amount: 1,
                policy_start_date: 1,
                policy_end_date: 1,
                createdAt: 1,
                updatedAt: 1,
                account_name: "$accountNameResult.account_name"
            }
        },
        {
            $group: {
                _id: "$_id",
                account_name: { $first: "$account_name" },
                policies: {
                    $push: {
                        _id: "$_id",
                        firstname: "$firstname",
                        dob: "$dob",
                        address: "$address",
                        phone: "$phone",
                        state: "$state",
                        zip: "$zip",
                        email: "$email",
                        gender: "$gender",
                        policy_number: "$policy_number",
                        policy_type: "$policy_type",
                        producer: "$producer",
                        csr: "$csr",
                        agent: "$agent",
                        company_name: "$company_name",
                        premium_amount: "$premium_amount",
                        policy_start_date: "$policy_start_date",
                        policy_end_date: "$policy_end_date",
                        category_name: "$category_name",
                        createdAt: "$createdAt",
                        updatedAt: "$updatedAt"
                    }
                }
            }
        }
    ]);
    // console.log("After grouping policies:", groupResult);

    return groupResult;
}



// Exporting functions
module.exports = {
    addUser,
    addAgent,
    addCarrier,
    addCategory,
    addAccountName,
    addPolicy,
    getUserName,
    getUserPolicy,
    getUserPolicies
};






 


