<?php
// admin.php — simple admin viewer for submissions.csv
$ADMIN_PASSWORD = 'change_this_password'; // <-- CHANGE THIS
session_start();

if(isset($_POST['password'])){
    if($_POST['password'] === $ADMIN_PASSWORD){
        $_SESSION['admin'] = true;
    } else {
        $error = "Wrong password";
    }
}

// logout
if(isset($_GET['logout'])){
    session_destroy();
    header('Location: admin.php'); exit;
}

// download CSV
if(isset($_GET['download']) && isset($_SESSION['admin']) && $_SESSION['admin']){
    $file = __DIR__ . '/submissions.csv';
    if(file_exists($file)){
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="submissions.csv"');
        readfile($file);
        exit;
    } else {
        $error = "No submissions.csv file found.";
    }
}

$logged = isset($_SESSION['admin']) && $_SESSION['admin'];
?>
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Admin — Submissions</title>
<style>
  body{font-family:Arial,Helvetica,sans-serif;background:#f6f8fb;color:#111;padding:18px}
  .wrap{max-width:980px;margin:20px auto;background:#fff;padding:16px;border-radius:8px;box-shadow:0 8px 30px rgba(2,6,23,0.06)}
  table{width:100%;border-collapse:collapse}
  td,th{padding:8px;border-bottom:1px solid #eee;font-size:13px}
  .top{display:flex;gap:8px;align-items:center}
  .btn{padding:8px 10px;border-radius:6px;border:0;cursor:pointer}
  .btn-primary{background:#0ea5a4;color:#fff}
  .muted{color:#666}
  form{margin-top:12px}
</style>
</head>
<body>
<div class="wrap">
  <div class="top">
    <h2 style="margin:0">Submissions — Admin</h2>
    <?php if($logged): ?>
      <div style="margin-left:auto">
        <a href="admin.php?download=1" class="btn btn-primary">Download CSV</a>
        <a href="admin.php?logout=1" class="btn">Logout</a>
      </div>
    <?php endif; ?>
  </div>

  <?php if(!$logged): ?>
    <p class="muted">Enter admin password to view submissions.</p>
    <?php if(!empty($error)) echo "<div style='color:#b91c1c'>$error</div>"; ?>
    <form method="post">
      <input name="password" type="password" placeholder="Admin password" style="padding:8px;border-radius:6px;border:1px solid #ddd">
      <button class="btn btn-primary" type="submit">Login</button>
    </form>
  <?php else: ?>
    <?php
      $file = __DIR__ . '/submissions.csv';
      if(!file_exists($file)){ echo "<p class='muted'>No submissions yet.</p>"; }
      else {
        $lines = array_map('trim', file($file));
        echo "<table><thead><tr><th>#</th><th>Timestamp</th><th>Name</th><th>Email</th><th>Phone</th><th>Course</th><th>Bio</th></tr></thead><tbody>";
        $i=0;
        foreach($lines as $ln){
          $i++;
          // naive CSV parse: split by "," but fields are quoted -- use str_getcsv
          $cols = str_getcsv($ln);
          echo "<tr>";
          echo "<td>$i</td>";
          for($j=0;$j<count($cols);$j++){
            $cell = htmlspecialchars($cols[$j]);
            echo "<td>$cell</td>";
          }
          echo "</tr>";
        }
        echo "</tbody></table>";
      }
    ?>
  <?php endif; ?>
</div>
</body>
</html>
