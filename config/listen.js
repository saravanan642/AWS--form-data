const listen = (app) => {
    try {
        const port = process.env.PORT;

        if (!app) {
            console.log("App is missing");
            return;
        }

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

    } catch (err) {
        console.log(err.message);
        console.log("Network error");
    }
};

module.exports = listen;