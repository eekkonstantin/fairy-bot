-- CreateIndex
CREATE INDEX "Code_expired_expireAt_idx" ON "Code"("expired", "expireAt");

-- CreateIndex
CREATE INDEX "Code_expired_deleteAt_idx" ON "Code"("expired", "deleteAt");

-- CreateIndex
CREATE INDEX "CodeMessage_codeId_removed_idx" ON "CodeMessage"("codeId", "removed");
