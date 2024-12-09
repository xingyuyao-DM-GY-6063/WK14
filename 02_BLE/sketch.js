let SERVICE_UUID = "250b0d00-1b4f-4f16-9171-f63c733d8114";

let mBLE;
let mCharacteristic;

let connectButton;

let readyToRead;
let cBackgroundColor;

function gotValue(error, value) {
  if (error || value.charAt(0) != "{") {
    print("error: ", error || value);
    readyToRead = true;
    return;
  }

  let data = JSON.parse(value).data;
  let a0 = data.A0;

  cBackgroundColor = map(a0.value, a0.min, a0.max, 0, 255);
  readyToRead = true;
}

function gotCharacteristics(error, characteristics) {
  if (error) {
    print("error: ", error);
    return;
  }

  mCharacteristic = characteristics[0];
  readyToRead = true;
}

function connectToBle() {
  mBLE.connect(SERVICE_UUID, gotCharacteristics);
  connectButton.hide();
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  cBackgroundColor = 0;
  readyToRead = false;

  mBLE = new p5ble();

  connectButton = createButton("Connect To BLE");
  connectButton.position(width / 2, height / 2);
  connectButton.mousePressed(connectToBle);
}

function draw() {
  background(cBackgroundColor);

  if (readyToRead) {
    readyToRead = false;
    mBLE.read(mCharacteristic, "string", gotValue);
  }
}
