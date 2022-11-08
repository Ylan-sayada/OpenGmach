import { isValid } from 'date-fns';
import { checkSchema } from 'express-validator'
export default checkSchema({
    message: {
        isString: true,
        trim: true,
        isLength: {
            options: {
                min: 2
            }
        }
    }, user_ID: {
        isMongoId: true
    }, creationDate: {
        toDate: true,
        custom: {
            options: (value) => {
                return isValid(value);
            }
        }
    }
});