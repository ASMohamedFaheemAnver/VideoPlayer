import { useEffect, useState } from "react";
import "./styles.css";

const TimeLine = ({ setSize, setLeft }) => {
  useEffect(() => {
    const timeSpan = document.querySelector(".time-span");
    const mainDiv = document.querySelector(".main");
    const rightResizer = document.querySelector(".resizer.right");
    const leftResizer = document.querySelector(".resizer.left");
    const clip = document.querySelector(".clip");

    // Resize box
    rightResizer.addEventListener("mousedown", onRightResizerMouseDown);
    leftResizer.addEventListener("mousedown", onLeftResizerMouseDown);

    let isResizing = false;
    function onRightResizerMouseDown(e) {
      // console.log({ onRightResizerMouseDown });
      isResizing = true;
      const previousMousePositionX = e.clientX;
      const timeSpanStartingState = timeSpan.getBoundingClientRect();
      const mainDivStartingState = mainDiv.getBoundingClientRect();
      window.addEventListener("mousemove", onRightResizerMouseMove);
      window.addEventListener("mouseup", onRightResizerMouseUp);
      function onRightResizerMouseMove(e) {
        e.preventDefault();
        // console.log({ onRightResizerMouseMove });
        const currentMousePositionX = e.clientX;
        const mouseMovedInX = currentMousePositionX - previousMousePositionX;
        const widthValue = timeSpanStartingState.width + mouseMovedInX;
        let widthPercent = (widthValue / mainDivStartingState.width) * 100;
        const leftPercent =
          ((timeSpanStartingState.left - mainDivStartingState.left) /
            mainDivStartingState.width) *
          100;
        const finalPercent = leftPercent + widthPercent;
        if (finalPercent > 100) {
          widthPercent = widthPercent - (finalPercent - 100);
        }
        if (widthPercent < 0) {
          widthPercent = 0;
        }
        setSize(widthPercent);
        timeSpan.style.width = widthPercent + "%";
      }
      function onRightResizerMouseUp(e) {
        // console.log({ onRightResizerMouseUp });
        isResizing = false;
        window.removeEventListener("mousemove", onRightResizerMouseMove);
        window.removeEventListener("mouseup", onRightResizerMouseUp);
      }
    }
    function onLeftResizerMouseDown(e) {
      // console.log({ onLeftResizerMouseDown });
      isResizing = true;
      const previousMousePositionX = e.clientX;
      const timeSpanStartingState = timeSpan.getBoundingClientRect();
      const mainDivStartingState = mainDiv.getBoundingClientRect();
      const initialMouseStartingPointX = mainDivStartingState.left;
      window.addEventListener("mousemove", onLeftResizerMouseMove);
      window.addEventListener("mouseup", onLeftResizerMouseUp);
      function onLeftResizerMouseMove(e) {
        e.preventDefault();
        // console.log({ onLeftResizerMouseMove });
        const currentMousePositionX = e.clientX;
        const mouseMovedInX = previousMousePositionX - currentMousePositionX;
        const widthValue = timeSpanStartingState.width + mouseMovedInX;
        let widthPercent = (widthValue / mainDivStartingState.width) * 100;
        const leftValue =
          timeSpanStartingState.left -
          mouseMovedInX -
          initialMouseStartingPointX;
        let leftPercent = (leftValue / mainDivStartingState.width) * 100;
        if (leftPercent < 0) {
          // Prevent fast left swipe glitch
          widthPercent = widthPercent + leftPercent;
          leftPercent = 0;
        }
        if (widthPercent < 0) {
          leftPercent = leftPercent + widthPercent;
          widthPercent = 0;
        }
        timeSpan.style.left = leftPercent + "%";
        timeSpan.style.width = widthPercent + "%";
        setSize(widthPercent);
        setLeft(leftPercent);
      }
      function onLeftResizerMouseUp(e) {
        // console.log({ onLeftResizerMouseUp });
        isResizing = false;
        window.removeEventListener("mousemove", onLeftResizerMouseMove);
        window.removeEventListener("mouseup", onLeftResizerMouseUp);
      }
    }

    // Move box
    timeSpan.addEventListener("mousedown", onTimeSpanMouseDown);
    function onTimeSpanMouseDown(e) {
      if (isResizing) return;
      // console.log({ onTimeSpanMouseDown });
      let previousMousePositionX = e.clientX;
      // let previousMousePositionY = e.clientY;
      const timeSpanStartingState = timeSpan.getBoundingClientRect();
      const mainDivStartingState = mainDiv.getBoundingClientRect();
      const initialMouseStartingPointX = mainDivStartingState.left;
      window.addEventListener("mousemove", onTimeSpanMouseMove);
      window.addEventListener("mouseup", onTimeSpanMouseUp);
      function onTimeSpanMouseMove(e) {
        e.preventDefault();
        // console.log({ onTimeSpanMouseMove });
        const currentMousePositionX = e.clientX;
        // const currentMousePositionY = e.clientY;
        const mouseMovedInX = currentMousePositionX - previousMousePositionX;
        // const mouseMovedInY = currentMousePositionY - previousMousePositionY;
        // console.log({
        //   mouseMovedInX,
        //   mouseMovedInY,
        //   boxLeft: timeSpanStartingState.left,
        //   boxRight: timeSpanStartingState.right,
        // });
        // To make it responsive
        const leftValue =
          timeSpanStartingState.left +
          mouseMovedInX -
          initialMouseStartingPointX;
        const divWidth = mainDivStartingState.width;
        const timeSpanPercent = (timeSpanStartingState.width / divWidth) * 100;
        let leftPercent = (leftValue / divWidth) * 100;
        const totalPercent = timeSpanPercent + leftPercent;
        if (leftPercent < 0) {
          leftPercent = 0;
        }
        if (totalPercent > 100) {
          leftPercent = 100 - timeSpanPercent;
        }
        timeSpan.style.left = leftPercent + "%";
        setLeft(leftPercent);
        // timeSpan.style.top = timeSpanStartingState.top + mouseMovedInY + "px";
        // console.log({
        //   finalLeft: timeSpan.style.left,
        //   finalTop: timeSpan.style.top,
        // });
      }
      function onTimeSpanMouseUp() {
        // console.log({ onTimeSpanMouseUp });
        window.removeEventListener("mousemove", onTimeSpanMouseMove);
        window.removeEventListener("mouseup", onTimeSpanMouseUp);
      }
    }
  }, []);
  return (
    <div className="main">
      <div className="time-span">
        <div className="resizer left"></div>
        <div className="resizer right"></div>
      </div>
    </div>
  );
};

export default TimeLine;
