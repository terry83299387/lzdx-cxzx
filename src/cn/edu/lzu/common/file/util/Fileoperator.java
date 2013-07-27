package cn.edu.lzu.common.file.util;

import java.io.FileNotFoundException;
import java.io.IOException;

public class Fileoperator {

	public boolean delFiles(java.io.File file) {

		if (file.isDirectory()) {
			for (java.io.File f : file.listFiles()) {
				delFiles(f);

			}
		}
		return file.delete();

	}

	public boolean moveFiles(String srcPath, String destPath,
			java.io.File srcFile, java.io.File destFile) {

		srcFile.renameTo(destFile);
		return true;

	}

	public boolean copyFiles(String srcPath, String destPath,
			java.io.File srcFile, java.io.File destFile) {
		String sPath = srcFile.getAbsolutePath().substring(srcPath.length());
		String dPath = destPath + sPath;

		if (srcFile.isDirectory()) {

			boolean suc = true;
			if (!new java.io.File(dPath).mkdirs()) {
				return false;
			}
			for (java.io.File f : srcFile.listFiles()) {

				java.io.File dFile = new java.io.File(destFile
						.getAbsolutePath()
						+ "/" + f.getName());

				if (!copyFiles(srcPath, destPath, f, dFile)) {
					suc = false;
				}

			}
			return suc;
		} else {
			try {
				copyFile(srcFile, destFile);
				return true;
			} catch (java.io.IOException e) {

				return false;
			}
		}

	}

	public void copyFile(java.io.File srcFile, java.io.File destFile)
			throws IOException {
		java.io.InputStream is = new java.io.FileInputStream(srcFile);
		java.io.BufferedInputStream bs = new java.io.BufferedInputStream(is);
		java.io.OutputStream out = new java.io.FileOutputStream(destFile);
		java.io.BufferedOutputStream bos = new java.io.BufferedOutputStream(out);
		int length;
		byte[] b = new byte[1024];
		try {
			while ((length = bs.read(b)) > 0) {
				bos.write(b, 0, length);
			}

		} finally {
			bos.flush();
			bos.close();
			bs.close();

		}

	}

	public boolean saveFileContent(java.io.File file, String content)
			throws IOException {
		java.io.BufferedWriter bw = null;
		java.io.FileWriter fw = new java.io.FileWriter(file);
		try {
			bw = new java.io.BufferedWriter(fw);

			bw.write(content);

			bw.close();
			return true;
		} finally {
			if (bw != null)
				bw.close();
		}

	}

}
