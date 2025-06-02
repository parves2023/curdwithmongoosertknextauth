import dbConnect from "../../../../lib/mongodb";
import Item from "../../../../models/Item";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const item = await Item.findById(params.id);
        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }
        return NextResponse.json(item);
    } catch (error) {
        console.error("Error fetching item:", error);
        return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
    }
}



export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const data = await req.json();
        const updatedItem = await Item.findByIdAndUpdate(params.id, data, { new: true });
        return NextResponse.json(updatedItem);
    } catch (error) {   
        console.error("Error updating item:", error);
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    } 
}

export async function DELETE(_, { params }) {
    try {
        await dbConnect();
        const deletedItem = await Item.findByIdAndDelete(params.id);
        return NextResponse.json(deletedItem);
    }
    catch (error) {
        console.error("Error deleting item:", error);
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }
}