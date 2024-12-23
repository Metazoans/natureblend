const fs = require('fs');
const multer = require('multer');
const path = require('path');

// 이미지 저장
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../images')); // 저장 경로
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // 고유한 파일명
  }
});

const upload = multer({ storage });

// 파일 업데이트시 기존 파일 삭제 추가
const deleteImage = (imagePath) => {
  if (fs.existsSync(imagePath)) {
    fs.unlink(imagePath, (err) => {
      if (err) console.error(`Failed to delete image: ${imagePath}`, err);
      else console.log(`Deleted image: ${imagePath}`);
    });
  }
};

module.exports = {
  upload: upload.single('machineImg'),
  deleteImage
}

