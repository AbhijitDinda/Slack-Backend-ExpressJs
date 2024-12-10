export default function crudRepository(model) {
    return {
        // model:schema,

        create: async function (data) {
            const newDoc = await model.create(data);
            return newDoc;
        },
        getAll: async function () {
            const newDoc = await model.find();
            return newDoc;
        },

        getById: async function (id) {
            const doc = await model.findById(id);
            return doc;
        },
        delete: async function (id) {
            const doc = await model.findByIdAndDelete(id);  
            return doc;
        },
        deleteMany: async function (modelId){
            const response = await model.deleteMany({
                _id:{
                    $in:modelId
                }
            })
            return response;

        },
        update: async function (id,data) {
            const updateDoc = await model.findByIdAndUpdate(id,data,{new:true})
            return updateDoc;
        }
    };
}