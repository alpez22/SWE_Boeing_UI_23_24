export default function parseSchema (schema, body){
    const parseResult = schema.safeParse(body); // => { success: true; data: body }
    if (parseResult.success) {
        return parseResult.data;
    }
    else{
        return null;
    }
}