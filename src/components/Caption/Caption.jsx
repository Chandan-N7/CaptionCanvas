import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import "./Caption.css";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineCropSquare, MdSmokingRooms } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa6";
import { LuTriangle } from "react-icons/lu";
import { MdOutlinePentagon } from "react-icons/md";
import { RiText } from "react-icons/ri";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { MdOutlineTextIncrease, MdOutlineTextDecrease } from "react-icons/md";
import { FaBold } from "react-icons/fa";


const Caption = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { imgUrl } = location.state || {};

  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [layers, setLayers] = useState([]);
  const [activeText, setActiveText] = useState(null);
  const [textStyles, setTextStyles] = useState({
    fontSize: 20,
    bold: false,
    color: "#000",
  });
  const [textInput, setTextInput] = useState(""); // State for text input field

  useEffect(() => {
    if (imgUrl && canvasRef.current) {
      const initCanvas = new fabric.Canvas(canvasRef.current);
      let pugImg = new Image();
      pugImg.crossOrigin = "Anonymous";
      pugImg.onload = function () {
        var pug = new fabric.Image(pugImg, {
          angle: 0,
          width: 500,
          height: 500,
          left: 50,
          top: 70,
          scaleX: 0.25,
          scaleY: 0.25,
        });
        initCanvas.add(pug);
        initCanvas.renderAll();
        logLayer({ type: "image", src: imgUrl, top: pug.top, left: pug.left });
      };
      pugImg.src = imgUrl;

      initCanvas.backgroundColor = "#fff";
      initCanvas.renderAll();
      setCanvas(initCanvas);

      return () => {
        if (initCanvas) {
          initCanvas.dispose();
        }
      };
    } else {
      navigate("/");
    }
  }, [imgUrl, navigate]);

  const logLayer = (newLayer) => {
    setLayers((prevLayers) => [...prevLayers, newLayer]);
    console.log(layers);
  };

  const addRectangle = () => {
    if (canvas) {
      const rect = new fabric.Rect({
        top: 100,
        left: 50,
        width: 100,
        height: 60,
        fill: "#d84d42",
        selectable: true,
      });
      canvas.add(rect);
      canvas.renderAll();
      logLayer({
        type: "rectangle",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        fill: rect.fill,
      });
    }
  };

  const addCircle = () => {
    if (canvas) {
      const circle = new fabric.Circle({
        top: 80,
        left: 50,
        radius: 50,
        fill: "green",
        selectable: true,
      });
      canvas.add(circle);
      canvas.renderAll();
      logLayer({
        type: "circle",
        top: circle.top,
        left: circle.left,
        radius: circle.radius,
        fill: circle.fill,
      });
    }
  };

  const addTriangle = () => {
    if (canvas) {
      const triangle = new fabric.Triangle({
        top: 80,
        left: 50,
        width: 100,
        height: 100,
        fill: "blue",
        selectable: true,
      });
      canvas.add(triangle);
      canvas.renderAll();
      logLayer({
        type: "triangle",
        top: triangle.top,
        left: triangle.left,
        width: triangle.width,
        height: triangle.height,
        fill: triangle.fill,
      });
    }
  };

  const addPolygon = () => {
    if (canvas) {
      const polygon = new fabric.Polygon(
        [
          { x: 200, y: 10 },
          { x: 250, y: 50 },
          { x: 250, y: 180 },
          { x: 150, y: 180 },
          { x: 150, y: 50 },
        ],
        {
          fill: "#87CEEB",
        }
      );
      canvas.add(polygon);
      canvas.renderAll();
      logLayer({ type: "polygon", points: polygon.points, fill: polygon.fill });
    }
  };

  const addText = () => {
    if (canvas) {
      const text = new fabric.Textbox("Text here", {
        top: 80,
        left: 50,
        width: 200,
        fill: textStyles.color,
        editable: true,
        fontSize: textStyles.fontSize,
        fontWeight: textStyles.bold ? "bold" : "normal",
        cornerStyle: "round",
        cornerSize: 10,
        padding: 10,
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
      setActiveText(text);
      setTextInput("Text here"); // Set initial text input value
      logLayer({
        type: "text",
        content: "Text here",
        top: text.top,
        left: text.left,
        width: text.width,
      });
    }
  };

  const downloadImage = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
      });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas-image.png";
      link.click();
    }
  };

  const updateCanvasSize = () => {
    if (canvasRef.current && canvas) {
      try {
        const width = window.innerWidth <= 560 ? window.innerWidth - 100 : 500;
        canvas.setWidth(width);
        canvas.renderAll();
      } catch (error) {
        console.error("Error updating canvas size:", error);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize(); // Initial call

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [canvas]);

  const increaseFontSize = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        const newSize = activeObject.fontSize + 2;
        activeObject.set({ fontSize: newSize });
        canvas.renderAll();
        setTextStyles((prevStyles) => ({ ...prevStyles, fontSize: newSize })); // Update textStyles
      }
    }
  };

  const decreaseFontSize = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        const newSize = Math.max(10, activeObject.fontSize - 2); // Minimum font size of 10
        activeObject.set({ fontSize: newSize });
        canvas.renderAll();
        setTextStyles((prevStyles) => ({ ...prevStyles, fontSize: newSize })); // Update textStyles
      }
    }
  };

  const toggleBold = () => {
    if (canvas && activeText) {
      const newBold = !textStyles.bold;
      activeText.set({ fontWeight: newBold ? "bold" : "normal" });
      canvas.renderAll();
      setTextStyles((prevStyles) => ({ ...prevStyles, bold: newBold }));
    }
  };

  const handleTextColorChange = (event) => {
    const newColor = event.target.value;
    if (canvas && activeText) {
      activeText.set({ fill: newColor });
      canvas.renderAll();
      setTextStyles((prevStyles) => ({ ...prevStyles, color: newColor }));
    }
  };

  return (
    <div className="caption">
      <div className="toolbar">
        <div className="tool-icon" onClick={addRectangle}>
          <MdOutlineCropSquare className="icon" />
        </div>
        <div className="tool-icon" onClick={addCircle}>
          <FaRegCircle className="icon" />
        </div>
        <div className="tool-icon" onClick={addTriangle}>
          <LuTriangle className="icon" />
        </div>
        <div className="tool-icon" onClick={addPolygon}>
          <MdOutlinePentagon className="icon" />
        </div>
        <div className="tool-icon" onClick={addText}>
          <RiText className="icon" />
        </div>
        <div className="tool-icon" onClick={downloadImage}>
          <IoCloudDownloadOutline className="icon" />
        </div>
      </div>

      <canvas id="canvas" ref={canvasRef} width="500" height="500"></canvas>

      <div className="toolbar">
        <div className="tool-icon" onClick={increaseFontSize}>
          <MdOutlineTextIncrease className="icon" />
        </div>
        <div className="tool-icon" onClick={decreaseFontSize}>
          <MdOutlineTextDecrease className="icon" />
        </div>
        <div className="tool-icon" onClick={toggleBold}>
          <FaBold className="icon" />
        </div>
        <input
          type="color"
          value={textStyles.color}
          onChange={handleTextColorChange}
          title="Change Text Color"
        />
      </div>
    </div>
  );
};

export default Caption;
