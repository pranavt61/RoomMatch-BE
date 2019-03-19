scp -ri ~/.ssh/EC2-USER-AWS.pem ec2-user@18.222.255.4 \
  ./src/ \
  ./index.js \
  ./package.json \
  ec2-user@18.222.255.4:~/RoomMatch-BE/
