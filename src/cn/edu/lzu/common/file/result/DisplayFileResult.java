package cn.edu.lzu.common.file.result;



import java.io.IOException;

import javax.servlet.http.HttpServletResponse;
import org.apache.struts2.ServletActionContext;


import cn.edu.lzu.common.file.action.ShowFileContent;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.Result;

/**
 * @author yyliu
 * This is designed for simple file's display.    
 *   At first,It needs to write the tag of result-type.
 *   Secondly ,set the attribute of type to the value of "displayResult" within the tag of result.
 *   Notice:
 *   If use displayResult as result type, the action should implement getContentType and getInputStream, which DisplayFileResult needs.
 *    
 * e.g.
 *  <result-types>
			<result-type name="displayResult"
				class="ssc.net.cn.ecp.portal.bl.file.result.DisplayFileResult" />
		</result-types>
	<result name="success" type="displayResult">
 */
public class DisplayFileResult implements Result {

	/**
	 * 
	 */
	private static final long serialVersionUID = 4897546905647587338L;
	private HttpServletResponse response;
	ShowFileContent action;

	public void execute(ActionInvocation invocation) throws Exception {

		init(invocation);

		writeResponseOutputStream();

	}

	private void init(ActionInvocation invocation) {

		action = (ShowFileContent) invocation.getAction();
		response = ServletActionContext.getResponse();
		response.setContentType(action.getContentType());
	}

	private void writeResponseOutputStream() {
		java.io.InputStream is = action.getInputStream();
		java.io.BufferedInputStream bi = null;
		if (is == null) {
			return;
		}

		try {

			bi = new java.io.BufferedInputStream(is);
			byte[] bytearray = new byte[1024];
			int size = 0;
			while ((size = bi.read(bytearray)) != -1) {
				response.getOutputStream().write(bytearray, 0, size);
			}
		} catch (IOException e) {
			e.printStackTrace();

		} finally {
			try {
				response.flushBuffer();
			} catch (IOException e) {

				e.printStackTrace();
			}
			try {
				bi.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
			try {
				is.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

	}

}