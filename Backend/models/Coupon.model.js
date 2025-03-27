import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number, // Discount percentage or fixed amount
        required: true
    },
    category: {
        type: String,
        enum: ["Food", "Electronics", "Fashion", "Grocery", "Other"],
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["Available", "Exchanged", "Expired"],
        default: "Available"
    }
}, { timestamps: true });

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
