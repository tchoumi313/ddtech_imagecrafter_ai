import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";

const CreatePost = () => {
  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch(
          "https://dalle-imagecrafter-dt.onrender.com/api/v1/dalle",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: form.prompt }),
          }
        );

        const data = await response.json();
        setForm({
          ...form,
          photo: `data:image/jpeg;base64,${data.photo}`,
        });

        /* if (response.status === 200) {
  setImg(data.img);
} */
      } catch (error) {
        alert(error);
        console.log(error);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please enter a prompt");
    }
  };

  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", prompt: "", photo: "" });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch(
          "https://dalle-imagecrafter-dt.onrender.com/api/v1/post",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          }
        );

        await response.json();
        navigate("/");
      } catch (error) {
        console.log(error);
        alert("Error: " + error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a prompt and generate an image");
    }
  };
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({
      ...form,
      prompt: randomPrompt,
    });
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          Create
          <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
            Create imaginative and visual images through DALL-E AI and share
            them with the community
          </p>
        </h1>
      </div>
      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            placeholder="Donald T"
            name="name"
            type="text"
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            labelName="Prompt"
            placeholder="a surrealist dream-like oil painting by Salvador Dalí of a cat playing checkers"
            name="prompt"
            type="text"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div
            className="relative bg-gray-50 border border-gray-500
                                  text-gray-900 text-sm rounded-lg focus:ring-blue-500
                                  focus:border-blue-500 w-64 p-3 h-67 flex justify-center items-center"
          >
            {" "}
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt={preview}
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}
            {generatingImg && (
              <div
                className="absolute inset-0 z-0 flex
                                              rounded-lg bg-[rgba(0,0,0,0.5)] justify-center
                                              items-center"
              >
                <Loader />
              </div>
            )}{" "}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-700 text-sm w-full sm:w-auto rounded-md text-center px-5 py-2.5 "
          >
            {" "}
            {generatingImg ? "Generating..." : "Generate"}{" "}
          </button>
        </div>
        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            Once you have created the image you want, you can share it with
            others in the community
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-blue-700 text-sm w-full sm:w-auto rounded-md text-center px-5 py-2.5 "
          >
            Share with the community
          </button>
        </div>
      </form>
    </section>
  );
};
export default CreatePost;
