#d99a887f-da0b-11ed-9794-416243f2837a
import socket
def about():
  all = []
  name = socket gethostname()
  ip = socket.gethostbyname(name)
  if name == "localhost":
    all.append("设备:手机/Turmux")
  else:
    all.append("设备:电脑")
  all.append("IP:{}".format(ip))
  try:
    from dll.system import find_file
    af = find_file.list_all()
    all.append("目录:{}".format("".join(str(af))))
  except Exception as Err:
    all.append("目录:{}".format(str(Err)))
  
  return all
