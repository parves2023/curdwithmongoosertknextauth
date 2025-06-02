import dbConnect from "../../../lib/mongodb";
import Item from "../../../models/Item";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        const items = await Item.find({});
        return NextResponse.json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
    }
    }

    export async function POST(request) {
        try {
            await dbConnect();
            const data = await request.json();
            const newItem = new Item(data);
            await newItem.save();
            return NextResponse.json(newItem, { status: 201 });
        } catch (error) {
            console.error("Error creating item:", error);
            return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
        }
    }