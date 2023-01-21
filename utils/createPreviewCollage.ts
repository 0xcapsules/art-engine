"use strict";

//const isLocal = typeof process.pkg === "undefined";
// const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const basePath = process.cwd();
import fs from "fs";
import path from "path";
import  { createCanvas, loadImage } from "canvas";
const buildDir: string = `${basePath}/build`;
import { preview } from "../src/config";

// read json data
const rawdata: Buffer = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
const metadataList = JSON.parse(rawdata.toString());

const saveProjectPreviewImage = async (_data: any) => {
  // Extract from preview config
  const { thumbWidth, thumbPerRow, imageRatio, imageName } = preview;
  // Calculate height on the fly
  const thumbHeight = thumbWidth * imageRatio;
  // Prepare canvas
  const previewCanvasWidth = thumbWidth * thumbPerRow;
  const previewCanvasHeight =
    thumbHeight * Math.trunc(_data.length / thumbPerRow);
  // Shout from the mountain tops
  console.log(
    `Preparing a ${previewCanvasWidth}x${previewCanvasHeight} project preview with ${_data.length} thumbnails.`
  );

  // Initiate the canvas now that we have calculated everything
  const previewPath = `${buildDir}/${imageName}`;
  const previewCanvas = createCanvas(previewCanvasWidth, previewCanvasHeight);
  const previewCtx = previewCanvas.getContext("2d");

  // Iterate all NFTs and insert thumbnail into preview image
  // Don't want to rely on "edition" for assuming index
  for (let index = 0; index < _data.length; index++) {
    const nft = _data[index];
    await loadImage(`${buildDir}/images/${nft.edition}.png`).then((image: any) => {
      previewCtx.drawImage(
        image,
        thumbWidth * (index % thumbPerRow),
        thumbHeight * Math.trunc(index / thumbPerRow),
        thumbWidth,
        thumbHeight
      );
    });
  }

  // Write Project Preview to file
  fs.writeFileSync(previewPath, previewCanvas.toBuffer("image/png"));
  console.log(`Project preview image located at: ${previewPath}`);
};

saveProjectPreviewImage(metadataList);
