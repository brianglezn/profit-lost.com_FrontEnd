import { Button, TextField } from "@mui/material";

import "./FormAccounts.css";

interface FormAccountsProps {
    onClose: () => void;
}

function FormAccounts({ onClose }: FormAccountsProps) {

    return (
        <>
            <form className="formAccounts">
                <span className="material-symbols-rounded no-select formAccounts-closeButton" onClick={onClose}>
                    close
                </span>

                <TextField
                    label="New Account"
                    value={""}
                    // onChange={""}
                    className="textFieldCustomPadding"
                />

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
        </>
    );
}

export default FormAccounts;
