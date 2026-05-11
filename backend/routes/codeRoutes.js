const express=require('express');
const router=express.Router();
const Code = require('../models/Code');
router.post('/save-code', async (req, res) => {

  try {
    const { roomId, code, username} = req.body;

    let codeDoc = await Code.findOne({ roomId, username });
    if (codeDoc) {
      codeDoc.code = code;
    } else {
      codeDoc = new Code({ roomId, code, username });
    }
    await codeDoc.save();   
    res.status(200).json({ message: 'Code saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

router.get('/get-code/:username', async (req, res) => {

  try {
    const { username } = req.params;
    const codeDoc = await Code.find({ username:username });
    
    if (codeDoc) {
      res.status(200).json({ codes: codeDoc });
    } else {
      res.status(404).json({ message: 'Code not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/delete-code/:id', async (req, res) => {

  try {
    const { id } = req.params;
    const codeDoc = await Code.findByIdAndDelete(id);
    
    if (codeDoc) {
      res.status(200).json({ message: 'Code deleted successfully' });
    } else {
      res.status(404).json({ message: 'Code not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;