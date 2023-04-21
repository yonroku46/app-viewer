import React, { useEffect, useReducer, useState } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";

export default function Empty() {

  const navigate = useNavigate();

  return(
    <>
    empty
    <button onClick={() => navigate(-1)}>back</button>
    </>
  )
}