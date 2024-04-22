import React from "react";
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Container,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import Webcam from "react-webcam";
import DashboardAppBar from "./DashboardAppBar";
import DashboardDrawer from "./DashboardDrawer";
import BillingSection from "../../sections/BillingSection";
import { Outlet, Route, Routes } from "react-router-dom";

function Dashboard() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <DashboardAppBar />
      {/* <Toolbar /> */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
        }}
      >
        {/* <DashboardDrawer /> */}
        <Outlet />
      </Box>
    </Box>
  );
}

export default Dashboard;
