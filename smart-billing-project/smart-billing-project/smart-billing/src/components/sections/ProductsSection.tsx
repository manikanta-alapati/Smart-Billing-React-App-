import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios({
      baseURL: process.env.REACT_APP_BACKEND_DOMAIN,
      url: "/product/all",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      responseType: "json",
    })
      .then((response) => {
        setProducts(response.data["products"]);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {products.map(({ id, name, class_name: className, cost }) => {
        return (
          <Box
            key={id}
            sx={{
              width: 250,
              margin: "20px",
              boxShadow: 2,
              cursor: "pointer",
            }}
          >
            <Box
              style={{
                height: "225px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src={`/images/products/${className}.png`} alt={name} />
            </Box>
            <Divider />
            <Box sx={{ padding: "20px" }}>
              <Typography gutterBottom variant="h5" component="div">
                {name}
              </Typography>
              <Typography variant="body2" color="text.success">
                ${cost}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default ProductsSection;
