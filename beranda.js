<!-- === POPUP ASET INFO === -->
<div id="infoPopup" class="popup-overlay" style="display: none;">
  <div class="popup-content">
    <button class="close-popup" onclick="closePopup()">✖</button>
    <h2>Estimasi Nilai Aset</h2>
    <p>Estimasi nilai aset merupakan perkiraan nilai total dari seluruh aset yang Anda miliki.</p>
  </div>
</div>

<script>
  function openPopup() {
    document.getElementById('infoPopup').style.display = 'flex';
  }

  function closePopup() {
    document.getElementById('infoPopup').style.display = 'none';
  }
</script>
