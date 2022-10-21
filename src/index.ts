// setup hello world express

import express from "express";
import type { Request, Response } from "express";
import { satoriHandler } from "./satori";
import fs from "fs";
import path from "path";

const app = express();

import { RequestHandler } from "express";
import type { BootOptions } from "@jetshop/core/components/ConfigProvider";
import type { Product, Category } from "@jetshop/core/types";
import satori from "satori";
import { html } from "satori-html";

interface ResponseData {
  data: {
    route?: {
      object?:
        | Pick<
            Product,
            | "__typename"
            | "name"
            | "subName"
            | "price"
            | "previousPrice"
            | "campaigns"
            | "images"
          >
        | Pick<Category, "__typename" | "name" | "parent" | "images">;
    };
  };
  errors?: any[];
}

app.get("/", async (req, res) => {
  const { html: htmlString } = req.query;

  if (!htmlString || typeof htmlString !== "string") {
    res.status(400).send("Missing html");
    return;
  }

  const filePath = path.join(process.cwd(), "./SourceCodePro-Regular.ttf");
  const fontData = fs.readFileSync(filePath);

  const markup = html(htmlString);
  const svg = await satori(markup as any, {
    height: 400,
    width: 600,
    fonts: [
      {
        name: "Source Code Pro",
        data: fontData,
      },
    ],
  });

  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(svg);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
