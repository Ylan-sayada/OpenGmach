
export const manageObj = {
    show: { type: Boolean, required: false },
    create: { type: Boolean, required: false },
    remove: { type: Boolean, required: false },
    update: { type: Boolean, required: false }
}

export const string = { type: String }

export const boolean = {
    type: Boolean
}
export const number = {
    type: Number
}
export const required = {
    required: true
}
export const handleDecimal = (value: any) => {
    return value.$numberDecimal;
};

