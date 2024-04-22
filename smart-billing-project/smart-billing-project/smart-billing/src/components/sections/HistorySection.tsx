// import {
//   Accordion,
//   AccordionDetails,
//   AccordionSummary,
//   Box,
//   styled,
//   Table,
//   TableBody,
//   TableCell,
//   tableCellClasses,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Container } from "@mui/system";

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.common.black,
//     color: theme.palette.common.white,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: theme.palette.action.hover,
//   },
//   // hide last border
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
// }));

// const HistorySection = () => {
//   const [billingHistory, setBillingHistory] = useState([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [expanded, setExpanded] = useState(-1);

//   useEffect(() => {
//     axios({
//       baseURL: process.env.REACT_APP_BACKEND_DOMAIN,
//       url: "/billing/history",
//       method: "post",
//       headers: {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "GET, POST",
//         "Access-Control-Allow-Headers": "Content-Type, Authorization",
//         Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
//       },
//       responseType: "json",
//     })
//       .then((response) => {
//         setIsLoading(true);
//         setBillingHistory(response.data["history"] ?? []);
//       })
//       .catch((e) => {})
//       .finally(() => {
//         setIsLoading(false);
//       });
//   }, []);
//   console.log("history", billingHistory);
//   return (
//     <Container>
//       <Typography variant="h4" sx={{ margin: "20px 0px" }}>
//         Billing History
//       </Typography>
//       <Box sx={{ width: "100%" }}>
//         {billingHistory.map(
//           ({
//             purchase_id: purchaseId,
//             purchase_created: purchaseCreated,
//             products,
//           }: any) => {
//             return (
//               <Accordion
//                 key={purchaseId}
//                 expanded={expanded === purchaseId}
//                 onChange={() =>
//                   setExpanded((prev) => (prev === purchaseId ? -1 : purchaseId))
//                 }
//               >
//                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                   <Typography>{purchaseId}. Purchase</Typography>
//                   <Typography sx={{ marginLeft: "auto", marginRight: "10px" }}>
//                     {new Date(purchaseCreated).toLocaleString()}
//                   </Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   <Table>
//                     <TableHead>
//                       <StyledTableRow>
//                         <StyledTableCell>Product Id</StyledTableCell>
//                         <StyledTableCell>Name</StyledTableCell>
//                         <StyledTableCell>Cost</StyledTableCell>
//                         <StyledTableCell>Count</StyledTableCell>
//                       </StyledTableRow>
//                     </TableHead>
//                     <TableBody>
//                       {products?.map(
//                         ({
//                           product_id: productId,
//                           product_name: productName,
//                           product_cost: productCost,
//                           product_count: productCount,
//                         }: any) => {
//                           return (
//                             <StyledTableRow key={productId}>
//                               <StyledTableCell>{productId}</StyledTableCell>
//                               <StyledTableCell>{productName}</StyledTableCell>
//                               <StyledTableCell>{productCount}</StyledTableCell>
//                               <StyledTableCell>{productCost}</StyledTableCell>
//                             </StyledTableRow>
//                           );
//                         }
//                       )}
//                     </TableBody>
//                   </Table>
//                   <Typography variant="body1">
//                     Total Cost:{" "}
//                     {products.reduce(
//                       (acc: number, { product_cost, product_count }: any) =>
//                         acc + product_cost * product_count,
//                       0
//                     )}
//                   </Typography>
//                 </AccordionDetails>
//               </Accordion>
//             );
//           }
//         )}
//       </Box>
//     </Container>
//   );
// };

// export default HistorySection;
import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Container, styled } from "@mui/material";
import axios from "axios";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function Row(props: { row: any }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          Purchase #{row.purchase_id}
        </TableCell>
        <TableCell align="right">
          {new Date(row.purchase_created).toLocaleString()}
        </TableCell>
        <TableCell align="right">
          {row.products.reduce(
            (acc: number, { product_cost, product_count }: any) =>
              acc + product_cost * product_count,
            0
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Bill
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Product Id</StyledTableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell align="right">Count</StyledTableCell>
                    <StyledTableCell align="right">Cost</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {row.products.map((product: any) => (
                    <StyledTableRow key={product.product_id}>
                      <StyledTableCell component="th" scope="row">
                        Product #{product.product_id}
                      </StyledTableCell>
                      <StyledTableCell>{product.product_name}</StyledTableCell>
                      <StyledTableCell align="right">
                        {product.product_count}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {product.product_cost}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function HistorySection() {
  const [billingHistory, setBillingHistory] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [expanded, setExpanded] = React.useState(-1);

  React.useEffect(() => {
    axios({
      baseURL: process.env.REACT_APP_BACKEND_DOMAIN,
      url: "/billing/history",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
      responseType: "json",
    })
      .then((response) => {
        setIsLoading(true);
        setBillingHistory(response.data["history"] ?? []);
      })
      .catch((e) => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  // const rows = [
  //   createData("Frozen yoghurt", 159, 6.0, 24, 4.0, 3.99),
  //   createData("Ice cream sandwich", 237, 9.0, 37, 4.3, 4.99),
  //   createData("Eclair", 262, 16.0, 24, 6.0, 3.79),
  //   createData("Cupcake", 305, 3.7, 67, 4.3, 2.5),
  //   createData("Gingerbread", 356, 16.0, 49, 3.9, 1.5),
  // ];
  return (
    <Container>
      <Typography variant="h4" sx={{ margin: "20px 0px" }}>
        Billing History
      </Typography>
      <Box sx={{ width: "100%" }}>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Purchase Id</TableCell>
                <TableCell align="right">Created</TableCell>
                <TableCell align="right">Total Cost</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billingHistory.map((row: any) => (
                <Row key={row.purchase_id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
