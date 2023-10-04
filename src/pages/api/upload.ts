import type { NextApiRequest, NextApiResponse, NextConfig, PageConfig, } from "next";
import formidable from "formidable";
import crypto from "crypto";
import { renameSync } from "node:fs";
import { dirname, join } from "path";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const names: string[] = [];

    const form = formidable({
        // filename: (name, ext, part, form) => {
        //     const newName = `${new Date().getTime()}-${crypto.randomInt(1000, 9999)}.${name}.${ext}`;
        //     console.log({ name, ext, newName });
        //     return newName;
        // }
    });

    const [fields, files] = await form.parse(req);

    Object.keys(files).map((field_name) => {
        const field = files[field_name];
        field?.map((file) => {
            const dir = dirname(file.filepath);
            const original = file.originalFilename;
            const newName = `${new Date().getTime()}-${crypto.randomInt(1000, 9999)}_${original}`;
            const newPath = join(dir, newName);
            renameSync(file.filepath, newPath);
            names.push(newName);
        });
    });

    res.json({names});
}

export const config: PageConfig = {
    api: {
        bodyParser: false,
    },
};
