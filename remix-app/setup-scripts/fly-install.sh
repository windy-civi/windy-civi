# Installing Fly Deployment Stuff

if ! command -v flyctl &> /dev/null
then
    echo "flyctl could not be found. installing..."
    curl -L https://fly.io/install.sh | sh
    exit
fi