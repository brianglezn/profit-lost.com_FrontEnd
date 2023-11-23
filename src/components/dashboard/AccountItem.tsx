import React from "react";
import { Box, Button, Modal } from "@mui/material";
import PropTypes from "prop-types";

import "./AccountItem.css";
import AccountsTable from "./AccountsTable";

// Definición de la interfaz para las propiedades del componente AccountItem
interface AccountItemProps {
  accountName: string;
  balance: string;
  customBackgroundColor: string;
  customColor: string;
}

// Validación de tipos de propiedades usando PropTypes
AccountItem.propTypes = {
  accountName: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  customBackgroundColor: PropTypes.string.isRequired,
  customColor: PropTypes.string.isRequired,
};

function AccountItem(props: AccountItemProps) {

  // Desestructuración de las propiedades para un acceso más fácil
  const { accountName, balance, customBackgroundColor, customColor } = props;

  // Modal
  const styleBox = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "var(--color-bg)",
    boxShadow: 15,
    p: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px"
  };

  const [open, setOpen] = React.useState(false);
  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const backdropStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(4px)',
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleCloseModal}
        componentsProps={{
          backdrop: {
            style: backdropStyle,
          },
        }}>
        <Box sx={styleBox}>
          <form className="formAccount">

            <AccountsTable />

            <Button
              className="formAccounts-send"
              // onClick={handleSaveAccount}
              sx={{
                borderColor: 'var(--color-orange-400)',
                borderWidth: 1,
                borderStyle: 'solid',
                '&:hover': {
                  color: 'var(--color-white)',
                  backgroundColor: 'var(--color-orange)',
                },
              }}
            >
              Save
            </Button>
          </form>
        </Box>
      </Modal>
      <div
        className="accounts__account-container"
        onClick={handleOpenModal}
        style={{ backgroundColor: customBackgroundColor, color: customColor }}
      >
        <p>{accountName}</p>
        <span>{balance}</span>
      </div>
    </>
  );
}

export default AccountItem;
