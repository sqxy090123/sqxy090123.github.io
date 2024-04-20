<?php
// 获取传递过来的主机名参数
$host = $_GET['host'];

// 执行 ping 操作并捕获输出
$output = shell_exec("ping -c 4 " . escapeshellarg($host));

// 解析 ping 结果并返回给客户端
if (strpos($output, "ttl=") !== false) {
    // 如果 ping 成功
    echo "<span class='fast'>Ping 成功：</span><br>";
    echo "<pre>$output</pre>";
} else {
    // 如果 ping 失败
    echo "<span class='failure'>Ping 失败：</span><br>";
    echo "<pre>$output</pre>";
}
?>