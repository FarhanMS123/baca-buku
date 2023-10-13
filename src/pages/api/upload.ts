import type { NextApiRequest, NextApiResponse, PageConfig, } from "next";
import formidable from "formidable";
import crypto from "crypto";
import { renameSync } from "node:fs";
import { dirname, join } from "path";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const names: Record<string, string[]> = {};

    const form = formidable({} as formidable.Options);

    const [fields, files] = await form.parse(req);

    for(const [field, ffiles] of Object.entries(files)) {
        if (ffiles != undefined) 
            for (const file of ffiles) {
                const dir = dirname(file.filepath);
                const original = file.originalFilename;
                const newName = `${new Date().getTime()}-${crypto.randomInt(1000, 9999)}_${original}`;
                const newPath = join(dir, newName);
                renameSync(file.filepath, newPath);

                if (typeof names[field] != "object" || names[field]!.constructor.name != Array.name) names[field] = [];
                names[field]!.push(newName);
            }
    }

    res.json({names});
}

export const config: PageConfig = {
    api: {
        bodyParser: false,
    },
};
