const path = require("path");

const roomSelectionBackgroundImage = path.join(__dirname, "../assets/textures/gameName/roomSelectionBackgroundImage.png");

const getImagePath = (folder, name) => path.join(__dirname, `../assets/textures/gameName/${folder}/${name}.png`);

const gameName = [
  roomSelectionBackgroundImage,
  [getImagePath("png1", "p1"), getImagePath("png2", "p1")],
  [getImagePath("png1", "p2"), getImagePath("png2", "p2")],
  [getImagePath("png1", "p3"), getImagePath("png2", "p3")],
  [getImagePath("png1", "p4"), getImagePath("png2", "p4")],
  [getImagePath("png1", "p5"), getImagePath("png2", "p5")],
  [getImagePath("png1", "p6"), getImagePath("png2", "p6")],
  [getImagePath("png1", "p7"), getImagePath("png2", "p7")],
  [getImagePath("png1", "p8"), getImagePath("png2", "p8")],
  [getImagePath("png1", "p9"), getImagePath("png2", "p9")],
  [getImagePath("png1", "p10"), getImagePath("png2", "p10")],
  [getImagePath("png1", "p11"), getImagePath("png2", "p11")],
  [getImagePath("png1", "p12"), getImagePath("png2", "p12")],
];

module.exports = { getImagePath, gameName, roomSelectionBackgroundImage };
