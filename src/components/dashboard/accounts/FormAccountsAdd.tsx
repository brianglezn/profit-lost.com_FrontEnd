import "./FormAccounts.scss";

function FormAccountsAdd() {

    return (
        <form className="formAccount">
            <h2>New account</h2>
            <input
                placeholder="name"
                className="custom-input"
            />
            <button type="submit" className="custom-btn">Save</button>
        </form>
    );
}

export default FormAccountsAdd;
