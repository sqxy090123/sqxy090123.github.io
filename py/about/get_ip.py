#d99a887f-da0b-11ed-9794-416243f2837a
def __check__():
  try:
    import socket
    import uuid
    import shutil
  except Exception as Err:
    print("前置文件缺失!\n{}".format(Err))
    return "False"
  try:
    import $.dll.system as s
  except:
    try:
      import dll.system as s
    except:
      print("缺失辅助文件!\n部分功能将无法正常使用!")
      return "Lost"
  return "True"
import socket
def about():
  ck = __check__()
  if ck == "False":
    return False
  if ck == "Lost":
    return __lost__()

def __lost__():
  all = []
  name = socket.gethostname()
  ip = socket.gethostbyname(name)
  if name == "localhost":
    all.append("设备:可移动设备/Turmux\n")
  else:
    all.append("设备:电脑\n")
  all.append("IP:{}\n".format(ip))
  all.append("目录:\033[32m缺少依赖项!\033[0m\n")
  print("".join(str(all)))
  return all



def __check_pass__():
  all = []
  name = socket.gethostname()
  ip = socket.gethostbyname(name)
  if name == "localhost":
    all.append("设备:可移动设备/Turmux\n")
  else:
    all.append("设备:电脑\n")
  all.append("IP:{}".format(ip))
  try:
    af = s.find_file.list_all()
    all.append("目录:{}\n".format("".join(str(af))))
  except Exception as Err:
    all.append("目录:{}\n".format(str(Err)))
  with open("about.log", "w+") as l:
    l.write("".join(str(all)))
  print("".join(str(all)))
  return all
