import React, { useState } from "react";
import axios from "axios";
import { FadeLoader } from "react-spinners";

import "./Main.css";
import { useNavigate } from "react-router-dom";
const Main = () => {
  const navigate = useNavigate();
  const [imgName, setImgName] = useState("");
  const [images, setImages] = useState("");
  const [errorHandle, setErrorHandle] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (imgName) {
        setLoader("true");
        const response = await axios.get(
          `https://pixabay.com/api/?key=45851088-b9816767e15eb12bc1ff9c8b4&q=${imgName}&image_type=photo&pretty=true`
        );
        setErrorHandle('')
          console.log(response.status);
          setImages(response.data.hits);
        if (response.data.hits.length <= 0) {
          setErrorHandle(
            "Oops! The image you're looking for could not be found"
          );
          setLoader(false);
          setImages("");

        }
        setLoader(false);
      } else {
        setErrorHandle("Please enter a keyword to search for images");
        setLoader(false);
        setImages("");

      }
    } catch (error) {
      setErrorHandle(
        "An error occurred while fetching images. Please try again later."
      );
      setLoader(false);
      setImages("");
      console.log(error);
    }
    setImgName('')
  };
  return (
    <div className="main">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search For Image"
          value={imgName}
          onChange={(e) => {
            setImgName(e.target.value);
          }}
        />
        <button type="submit">Search</button>
      </form>
      {loader ? (
        <div className="loader">
          <FadeLoader />
        </div>
      ) : (
        <div className="result">
          {images.length > 0 && (
            <div className="container">
              {images.map((img, i) => (
                <div className="item" key={i}>
                  <img src={img.webformatURL} alt="" className="item-image" />
                  <button
                    onClick={() => {
                      navigate("/add-caption", {
                        state: { imgUrl: img.webformatURL },
                      });
                    }}
                  >
                    Add Caption
                  </button>
                </div>
              ))}
            </div>
          )}
          {errorHandle && (
            <div className="errors">
              <p>{errorHandle}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Main;
