
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}




# Get the Resume Name Email and Phone Number and store it in a database
@app.post("/getDetails")
def get_details():
    return {"message": "Hello, World!"}




#  Create A Socket Connection for the Live Interview
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
      await websocket.accept()
      connected_clients.append(websocket)
      try:
            while True:
                  data = await websocket.receive_text()
                  for client in connected_clients:
                  await client.send_text(f"Message: {data}")

      except WebSocketDisconnect:
            connected_clients.remove(websocket)
