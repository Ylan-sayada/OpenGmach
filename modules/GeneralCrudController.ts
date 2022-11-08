import { FilterQuery, Model } from "mongoose";
class GeneralCrudController<T> {
    private Model;

    constructor(Model: Model<T>) {
        this.Model = Model;

    }
    /**
     * @returns Return all the element of the document
     */
    all = async () => {
        return await this.Model.find({});
    }
    /**
     * @param id The id of the element we want to remove
     * @returns Return true if the element was found and removed
     */
    remove = async (id: string, field: string) => {
        return (await this.Model.findById(id).deleteOne()) > 0;
    }

    /**
     * @param id[] The array of id to delete form db
     * @return Return true if the element was deleted
     */
    removeMany = async (id: string[], field: string) => {
        const query = {
            [`${field}`]: {
                $in: id
            }
        }
        return await this.Model.deleteMany(query as FilterQuery<any>);
    }
    /**
     * @param elements Add one or more object 
     * @returns Return the response from the db
     */
    add = async (elements: Object | Object[]) => {
        let response;
        try {
            response = (await this.Model.insertMany(elements))
        } catch (e) {
            response = e
        }
        return response;
    }
    /**
     * 
     * @param id Id of the element we want to update
     * @param dataToUpdate The data we want to update
     * @returns Return the data changes
     */
    update = async (_id: string, dataToUpdate: Object) => {
        let response
        try {
            response = await this.Model.findOneAndUpdate({ _id }, { $set: dataToUpdate });
        } catch (e) {
            response = e;
        }
        return response
    }
}
export default GeneralCrudController;