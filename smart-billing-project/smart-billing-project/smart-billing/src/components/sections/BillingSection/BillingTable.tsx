import {
  Box,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { FC, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import { BillingItem } from "./billing.types";

interface BillingTableProps {
  makeBilling: () => Promise<void>;
  billingItems: BillingItem[];
  dispatch: any;
}

const BillingTable: FC<BillingTableProps> = ({
  makeBilling,
  billingItems,
  dispatch,
}) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ marginBottom: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Count</TableCell>
              <TableCell>Unit Cost</TableCell>
              <TableCell>Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billingItems.map(({ id, name, unitCost, count, isSelected }) => {
              return (
                <TableRow key={id}>
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => {
                        dispatch({
                          type: "SET_IS_SELECTED",
                          payload: {
                            id,
                            isSelected: e.target.checked,
                          },
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      value={count || ""}
                      sx={{ width: "100px", borderWidth: 0 }}
                      onChange={(e) => {
                        dispatch({
                          type: "SET_COUNT",
                          payload: {
                            id,
                            count: Number(e.target.value),
                          },
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>${unitCost}</TableCell>
                  <TableCell>${unitCost * count}</TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell sx={{ borderWidth: "0px" }}></TableCell>
              <TableCell sx={{ borderWidth: "0px" }}></TableCell>
              <TableCell sx={{ borderWidth: "0px" }}></TableCell>
              <TableCell>
                <Typography variant="h6">Total Cost:</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">
                  $
                  {billingItems.reduce(
                    (acc, { unitCost, count }) => acc + unitCost * count,
                    0
                  )}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      {billingItems.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignSelf: "center",
          }}
        >
          {isLoggedIn && (
            <Button
              variant="contained"
              size="large"
              // color="secondary"
              // endIcon={<SendIcon />}
              sx={{ borderRadius: 0, marginRight: "20px" }}
              onClick={() => {
                makeBilling();
                navigate("/payment");
              }}
            >
              Make Bill
            </Button>
          )}
          <Button
            variant="contained"
            size="large"
            // color="secondary"
            // endIcon={<SendIcon />}
            color="secondary"
            sx={{ borderRadius: 0 }}
            onClick={() => {
              window.print();
            }}
          >
            Print Bill
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default BillingTable;
